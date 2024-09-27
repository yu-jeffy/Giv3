// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public campaigns;

    event CampaignCreated(address campaignAddress, address manager);

    function createCampaign(
        uint _goal,
        uint _deadline,
        string memory _image,
        string memory _campaignName,
        string memory _ownerName,
        string memory _description
    ) public payable {
        require(msg.value == 0.5 ether, "A 0.5 MATIC deposit is required to create a campaign.");

        Campaign newCampaign = new Campaign{value: msg.value}(
            msg.sender,
            _goal,
            _deadline,
            _image,
            _campaignName,
            _ownerName,
            _description
        );
        campaigns.push(address(newCampaign));
        emit CampaignCreated(address(newCampaign), msg.sender);
    }

    function getCampaigns() public view returns (address[] memory) {
        return campaigns;
    }
}