import Image from 'next/image'
import styles from '../styles/Create.module.css'

const Create = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create Campaign</h1>
            <form className={styles.form}>
                <label htmlFor="campaignName">Campaign Name</label>
                <input type="text" id="campaignName" name="campaignName" required />

                <label htmlFor="campaignDescription">Campaign Description</label>
                <textarea id="campaignDescription" name="campaignDescription" required />

                <label htmlFor="campaignImage">Campaign Image</label>
                <input type="file" id="campaignImage" name="campaignImage" required />

                <button type="submit">Publish Campaign</button>
            </form>
        </div>
    );
}

export default Create;