import React, { useState } from 'react';
import { ethers } from 'ethers';
import CampaignABI from '../abi/CampaignABI.json';

const campaignAddress = "0xee9E7Ee1d226fBdA56f789acF56c4FfD457584A6";

const Donate = () => {
  const [donationAmount, setDonationAmount] = useState('');

  const handleDonation = async (e) => {
    e.preventDefault();

    if (!window.ethereum) {
      return alert('Please install MetaMask to proceed.');
    }

    try {
      // Request account access if needed
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // We then get the provider from ethers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Create a new instance of the contract with a signer, which allows
      // update methods
      const campaign = new ethers.Contract(campaignAddress, CampaignABI, signer);
      
      // Convert the donation amount to the appropriate format (i.e., wei)
      const parsedAmount = ethers.utils.parseEther(donationAmount || '0');
      
      // Execute the donate transaction
      const tx = await campaign.donate({ value: parsedAmount });
      await tx.wait(); // Wait for the transaction to be mined
      
      alert('Donation Successful!');
      setDonationAmount(''); // Reset donation amount after successful donation
    } catch (err) {
      console.error('Donation error:', err);
      alert('Failed to donate. See console for details.');
    }
  };

  return (
    <form onSubmit={handleDonation}>
      <div>
        <label htmlFor="donationAmount">Donation Amount (ETH):</label>
        <input
          type="text"
          id="donationAmount"
          value={donationAmount}
          onChange={(e) => setDonationAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Donate</button>
    </form>
  );
};

export default Donate;