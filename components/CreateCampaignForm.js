import React, { useState } from 'react';
import { ethers } from 'ethers';
import CampaignFactoryABI from 'artifacts/contracts/giv3_v5.sol/CampaignFactory.json'; 

const CreateCampaignForm = ({ campaignFactoryAddress }) => {
  const [minimumDonation, setMinimumDonation] = useState('');
  const [goal, setGoal] = useState('');

  const createCampaign = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (!window.ethereum) {
      alert('Make sure you have MetaMask installed!');
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // Request user's account
      const signer = provider.getSigner();

      const campaignFactory = new ethers.Contract(
        campaignFactoryAddress,
        CampaignFactoryABI,
        signer
      );

      const transactionResponse = await campaignFactory.createCampaign(
        ethers.utils.parseEther(minimumDonation.toString()),
        ethers.utils.parseEther(goal.toString())
      );
      await transactionResponse.wait(); // Wait for the transaction to be mined

      alert('Campaign created successfully!');
      // Reset form
      setMinimumDonation('');
      setGoal('');
    } catch (err) {
      console.error('Error creating campaign:', err);
      alert('Failed to create campaign.');
    }
  };

  return (
    <form onSubmit={createCampaign}>
      <div>
        <label htmlFor="minimumDonation">Minimum Donation (ETH):</label>
        <textarea
          id="minimumDonation"
          value={minimumDonation}
          onChange={(e) => setMinimumDonation(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="goal">Goal (ETH):</label>
        <textarea
          id="goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
        />
      </div>
      <button type="submit">Create Campaign</button>
    </form>
  );
};

export default CreateCampaignForm;