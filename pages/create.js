import Image from 'next/image'
import styles from '../styles/Create.module.css'
import CreateCampaignForm from '../components/CreateCampaignForm';
import { YourCampaignFactoryAddress } from '../config'; // Ensure you have this constant properly set

const Create = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Page</h1>
            <div>
                <h1>Create a New Campaign</h1>
                <CreateCampaignForm campaignFactoryAddress={YourCampaignFactoryAddress} />
            </div>
        </div>
    );
}

export default Create;