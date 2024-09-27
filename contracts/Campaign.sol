// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Campaign is ReentrancyGuard {
    address public manager;
    uint public goal;
    uint public pledged;
    uint public deadline;
    bool public goalReached;
    bool public fundsClaimed;

    mapping(address => uint) public contributions;
    address[] public contributors;

    uint public refundIndex; // Keeps track of the refund processing progress
    uint public deposit;

    string public image; // Add image property
    string public campaignName; // Add campaign name property
    string public ownerName; // Add owner name property
    string public description; // Add description property

    event ContributionReceived(address contributor, uint amount);
    event FundsClaimed(address manager, uint amount);
    event RefundIssued(address contributor, uint amount);
    event RefundsProcessed(uint numProcessed);

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function.");
        _;
    }

    constructor(
        address _manager,
        uint _goal,
        uint _deadline,
        string memory _image,
        string memory _campaignName,
        string memory _ownerName,
        string memory _description
    ) payable {
        require(_deadline > block.timestamp, "Deadline must be in the future.");
        require(msg.value == 0.5 ether, "A 0.5 ETH deposit is required.");
        manager = _manager;
        goal = _goal;
        deadline = _deadline;
        deposit = msg.value;
        image = _image; // Initialize image
        campaignName = _campaignName; // Initialize campaign name
        ownerName = _ownerName; // Initialize owner name
        description = _description; // Initialize description
    }

    receive() external payable {} // Allow contract to receive Ether

    function contribute() public payable nonReentrant {
        require(block.timestamp < deadline, "Campaign has ended.");
        require(msg.value > 0, "Contribution must be greater than zero.");

        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        contributions[msg.sender] += msg.value;
        pledged += msg.value;

        emit ContributionReceived(msg.sender, msg.value);

        if (pledged >= goal) {
            goalReached = true;
        }
    }

    function claimFunds() public onlyManager nonReentrant {
        require(goalReached, "Funding goal not reached.");
        require(!fundsClaimed, "Funds have already been claimed.");

        fundsClaimed = true;
        uint amount = address(this).balance - deposit; // Exclude deposit
        payable(manager).transfer(amount);

        emit FundsClaimed(manager, amount);
    }

    function triggerRefunds(uint _numContributors) public nonReentrant {
        require(block.timestamp >= deadline, "Campaign is still ongoing.");
        require(!goalReached, "Funding goal was reached. Refunds are not available.");
        require(refundIndex < contributors.length, "All refunds have been processed.");

        uint numProcessed = 0;
        while (refundIndex < contributors.length && numProcessed < _numContributors) {
            address contributor = contributors[refundIndex];
            uint amount = contributions[contributor];
            if (amount > 0) {
                contributions[contributor] = 0;
                payable(contributor).transfer(amount);
                emit RefundIssued(contributor, amount);
            }
            refundIndex++;
            numProcessed++;
        }

        // Reward the caller (e.g., 0.01 ETH per batch)
        uint fixedReward = 0.01 ether; // Fixed reward per call
        if (deposit >= fixedReward) {
            payable(msg.sender).transfer(fixedReward);
            deposit -= fixedReward;
        } else if (deposit > 0) {
            payable(msg.sender).transfer(deposit);
            deposit = 0;
        }

        emit RefundsProcessed(numProcessed);
    }

    function getDetails() public view returns (
        address _manager,
        uint _goal,
        uint _pledged,
        uint _deadline,
        bool _goalReached,
        bool _fundsClaimed,
        uint _refundIndex,
        uint _totalContributors,
        string memory _campaignName,
        string memory _ownerName,
        string memory _description
    ) {
        return (
            manager,
            goal,
            pledged,
            deadline,
            goalReached,
            fundsClaimed,
            refundIndex,
            contributors.length,
            campaignName,
            ownerName,
            description
        );
    }
}