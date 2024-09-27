import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Link from 'next/link';
import Image from 'next/image';
import CampaignFactory from '../../artifacts/contracts/CampaignFactory.sol/CampaignFactory.json';
import Campaign from '../../artifacts/contracts/Campaign.sol/Campaign.json';
import styles from '../../styles/Campaigns.module.css';

const CAMPAIGN_FACTORY_ADDRESS = '0x83449E6622C6826D029F32641D6167b40C339974';

export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);
    const [featuredCampaign, setFeaturedCampaign] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCampaigns() {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(CAMPAIGN_FACTORY_ADDRESS, CampaignFactory.abi, provider);
            const campaignAddresses = await contract.getCampaigns();

            const campaignDetails = await Promise.all(campaignAddresses.map(async (address) => {
                const campaignContract = new ethers.Contract(address, Campaign.abi, provider);
                const details = await campaignContract.getDetails();
                const image = await campaignContract.image();

                return {
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
                    image
                };
            }));

            setCampaigns(campaignDetails);

            if (campaignDetails.length > 0) {
                const randomIndex = Math.floor(Math.random() * campaignDetails.length);
                setFeaturedCampaign(campaignDetails[randomIndex]);
            }

            setLoading(false);
        }

        fetchCampaigns();
    }, []);

    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Explore Campaigns</h1>
            {featuredCampaign && (
                <div className={styles.featuredCampaign}>
                    <h2 className={styles.featuredTitle}>Featured Campaign</h2>
                    <div className={styles.featuredContent}>
                        {featuredCampaign.image && (
                            <div className={styles.featuredImageWrapper}>
                                <Image
                                    src={featuredCampaign.image}
                                    alt={featuredCampaign.campaignName}
                                    layout="fill"
                                    objectFit="cover"
                                    unoptimized
                                />
                            </div>
                        )}
                        <div className={styles.featuredDetails}>
                            <h3 className={styles.featuredName}>{featuredCampaign.campaignName}</h3>
                            <p className={styles.featuredOwner}>by {featuredCampaign.ownerName}</p>
                            <p className={styles.featuredDescription}>{featuredCampaign.description}</p>
                            <div className={styles.featuredStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Goal</span>
                                    <span className={styles.statValue}>{featuredCampaign.goal} POL</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Pledged</span>
                                    <span className={styles.statValue}>{featuredCampaign.pledged} POL</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Contributors</span>
                                    <span className={styles.statValue}>{featuredCampaign.totalContributors}</span>
                                </div>
                            </div>
                            <Link href={`/campaigns/${featuredCampaign.address}`} className={styles.viewButton}>
                                View Campaign
                            </Link>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.campaignsGrid}>
                {campaigns.map((campaign, index) => (
                    <div key={index} className={styles.campaignCard}>
                        {campaign.image && (
                            <div className={styles.campaignImageWrapper}>
                                <Image
                                    src={campaign.image}
                                    alt={campaign.campaignName}
                                    layout="fill"
                                    objectFit="cover"
                                    unoptimized
                                />
                            </div>
                        )}
                        <div className={styles.campaignContent}>
                            <h2 className={styles.campaignName}>{campaign.campaignName}</h2>
                            <p className={styles.campaignOwner}>by {campaign.ownerName}</p>
                            <p className={styles.campaignDescription}>{campaign.description}</p>
                            <div className={styles.campaignStats}>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Goal</span>
                                    <span className={styles.statValue}>{campaign.goal} POL</span>
                                </div>
                                <div className={styles.statItem}>
                                    <span className={styles.statLabel}>Pledged</span>
                                    <span className={styles.statValue}>{campaign.pledged} POL</span>
                                </div>
                            </div>
                            <Link href={`/campaigns/${campaign.address}`} className={styles.viewButton}>
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}