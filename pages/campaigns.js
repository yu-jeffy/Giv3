import Image from 'next/image'
import styles from '../styles/Campaigns.module.css'

const Campaigns = () => {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Campaigns</h1>
            <div className={styles.campaignList}>
                <div className={styles.campaignItem}>
                    <Image src="/path/to/campaign1.jpg" alt="Campaign 1" width={500} height={300} />
                    <h2>Campaign 1</h2>
                    <p>Description for Campaign 1...</p>
                </div>
                <div className={styles.campaignItem}>
                    <Image src="/path/to/campaign2.jpg" alt="Campaign 2" width={500} height={300} />
                    <h2>Campaign 2</h2>
                    <p>Description for Campaign 2...</p>
                </div>
                {/* Add more campaign items as needed */}
            </div>
        </div>
    );
}

export default Campaigns;