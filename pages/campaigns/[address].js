import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Image from 'next/image'
import Campaign from '../../artifacts/contracts/Campaign.sol/Campaign.json'
import styles from '../../styles/CampaignView.module.css'
import Link from 'next/link'

export default function CampaignDetails() {
    const router = useRouter()
    const { address } = router.query
    const [campaign, setCampaign] = useState(null)
    const [loading, setLoading] = useState(true)
    const [donationAmount, setDonationAmount] = useState('')
    const [donationLoading, setDonationLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        if (!address) return

        async function fetchCampaignDetails() {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const campaignContract = new ethers.Contract(address, Campaign.abi, provider)
            const details = await campaignContract.getDetails()

            setCampaign({
                address,
                manager: details[0],
                goal: ethers.utils.formatEther(details[1]),
                pledged: ethers.utils.formatEther(details[2]),
                deadline: new Date(details[3].toNumber() * 1000).toLocaleString(),
                goalReached: details[4],
                fundsClaimed: details[5],
                refundIndex: details[6].toNumber(),
                totalContributors: details[7].toNumber(),
                campaignName: details[8],
                ownerName: details[9],
                description: details[10],
                image: await campaignContract.image()
            })
            setLoading(false)
        }

        fetchCampaignDetails()
    }, [address,successMessage])

    const handleDonate = async () => {
        if (!donationAmount) return

        setDonationLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const campaignContract = new ethers.Contract(address, Campaign.abi, signer)

        try {
            const tx = await campaignContract.contribute({ value: ethers.utils.parseEther(donationAmount) })
            await tx.wait()
            setSuccessMessage('Donation successful!')
            setErrorMessage('')
            // Optionally, refresh the campaign details
        } catch (error) {
            console.error(error)
            setErrorMessage('Donation failed!')
            setSuccessMessage('')
        } finally {
            setDonationLoading(false)
        }
    }

    if (loading) {
        return <div className={styles.loading}>Loading...</div>
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 className={styles.title}>{campaign.campaignName}</h1>
                <div className={styles.content}>
                    <div className={styles.imageContainer}>
                        <Image
                            src={campaign.image}
                            alt={campaign.campaignName}
                            layout="fill"
                            objectFit="cover"
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.details}>
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Campaign Details</h2>
                            <p><span>Owner:</span> <span className={styles.detailValue}>{campaign.ownerName}</span></p>
                            <p><span>Description:</span> <span className={styles.detailValue}>{campaign.description}</span></p>
                            <p>
                                <span>Wallet:</span>
                                <span className={styles.detailValue}>
                                    <Link style={{ color: 'purple', textDecoration: 'none', fontWeight: 'bold' }} href={`https://polygonscan.com/address/${campaign.manager}`}>
                                        PolygonScan
                                    </Link>
                                </span>
                            </p>
                            <p><span>Goal:</span> <span className={styles.detailValue}>{campaign.goal} POL</span></p>
                            <p><span>Pledged:</span> <span className={styles.detailValue}>{campaign.pledged} POL</span></p>
                            <p><span>Deadline:</span> <span className={styles.detailValue}>{campaign.deadline}</span></p>
                            <p><span>Goal Reached:</span> <span className={styles.detailValue}>{campaign.goalReached ? 'Yes' : 'No'}</span></p>
                            <p><span>Funds Claimed:</span> <span className={styles.detailValue}>{campaign.fundsClaimed ? 'Yes' : 'No'}</span></p>
                            <p><span>Total Contributors:</span> <span className={styles.detailValue}>{campaign.totalContributors}</span></p>
                        </div>
                        <div className={styles.donationSection}>
                            <h2 className={styles.cardTitle}>Make a Donation</h2>
                            <div className={styles.donationForm}>
                                <input
                                    type="text"
                                    placeholder="Amount in POL"
                                    value={donationAmount}
                                    onChange={(e) => setDonationAmount(e.target.value)}
                                    className={styles.input}
                                    aria-label="Donation amount in POL"
                                />
                                <button 
                                    onClick={handleDonate} 
                                    className={styles.button} 
                                    disabled={donationLoading}
                                >
                                    {donationLoading ? 'Loading...' : 'Donate'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {successMessage && (
                <div className={styles.successPopup}>
                    <span>{successMessage}</span>
                    <button onClick={() => setSuccessMessage('')} className={styles.closeButton}>X</button>
                </div>
            )}
            {errorMessage && (
                <div className={styles.errorPopup}>
                    <span>{errorMessage}</span>
                    <button onClick={() => setErrorMessage('')} className={styles.closeButton}>X</button>
                </div>
            )}
        </div>
    )
}