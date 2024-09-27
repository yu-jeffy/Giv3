import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import CampaignFactory from '../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json';
import styles from '../styles/Create.module.css';

const CAMPAIGN_FACTORY_ADDRESS = '0x83449E6622C6826D029F32641D6167b40C339974';

export default function CreateCampaign() {
    const [goal, setGoal] = useState('');
    const [deadline, setDeadline] = useState('');
    const [prompt, setPrompt] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [campaignName, setCampaignName] = useState(''); // New state for campaign name
    const [ownerName, setOwnerName] = useState(''); // New state for owner name
    const [description, setDescription] = useState(''); // New state for description
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);

    useEffect(() => {
        const isValid = goal && deadline && prompt && imageUrl && campaignName && ownerName && description;
        setIsFormValid(isValid);
    }, [goal, deadline, prompt, imageUrl, campaignName, ownerName, description]);

    const generateImage = async () => {
        setImageLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/dalle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            if (response.ok) {
                setImageUrl(data.imageUrl);
                setMessage('Image generated successfully!');
            } else {
                setMessage(data.error);
            }
        } catch (error) {
            setMessage('Failed to generate image');
        } finally {
            setImageLoading(false);
        }
    };

    const createCampaign = async (event) => {
        event.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            if (!window.ethereum) {
                throw new Error('No crypto wallet found. Please install it.');
            }

            await window.ethereum.send('eth_requestAccounts');
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(CAMPAIGN_FACTORY_ADDRESS, CampaignFactory.abi, signer);

            const goalInWei = ethers.utils.parseEther(goal);
            const deadlineTimestamp = Math.floor(new Date(deadline).getTime() / 1000);

            const tx = await contract.createCampaign(
                goalInWei,
                deadlineTimestamp,
                imageUrl,
                campaignName, // Pass campaign name
                ownerName, // Pass owner name
                description, // Pass description
                { value: ethers.utils.parseEther('0.5') }
            );
            await tx.wait();

            setMessage('Campaign created successfully!');
        } catch (error) {
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create a New Campaign</h1>
            <form onSubmit={createCampaign} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Campaign Name</label>
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Owner Name</label>
                    <input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Goal (in POL)</label>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Deadline</label>
                    <input
                        type="datetime-local"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Image Prompt</label>
                    <input
                        type="text"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className={styles.formInput}
                        required
                    />
                    <button type="button" onClick={generateImage} disabled={loading} className={styles.formButton}>
                        {loading ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>
                {imageUrl && (
                    <div className={styles.formGroup}>
                        <img src={imageUrl} alt="Generated" className={styles.generatedImage} />
                    </div>
                )}
                <button type="submit" disabled={!isFormValid} className={styles.formButton}>
                    {loading ? 'Creating...' : 'Create Campaign'}
                </button>
            </form>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
