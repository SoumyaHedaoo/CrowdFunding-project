// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CrowdFunding is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    enum CampaignStatus {
        Pending,
        Approved,
        Rejected
    }

    struct Campaign {
        address owner;
        string title;
        string description;
        uint256 target;
        uint256 deadline;
        uint256 amountCollected;
        string image;
        address[] donators;
        uint256[] donations;
        CampaignStatus status;
        string rejectionReason;
    }

    mapping(uint256 => Campaign) public campaigns;
    uint256 public numberOfCampaigns = 0;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _setRoleAdmin(ADMIN_ROLE, ADMIN_ROLE);
    }

    event CampaignCreated(uint256 indexed campaignId, address indexed owner);
    event CampaignApproved(uint256 indexed campaignId);
    event CampaignRejected(uint256 indexed campaignId, string reason);
    event DonationReceived(uint256 indexed campaignId, address indexed donor, uint256 amount);

    function createCampaign(
        address _owner,
        string memory _title,
        string memory _description,
        uint256 _target,
        uint256 _deadline,
        string memory _image
    ) public returns (uint256) {
        require(_deadline > block.timestamp, "Deadline must be in future");
        uint256 newCampaignId = numberOfCampaigns;
        
        Campaign storage campaign = campaigns[newCampaignId];

        campaign.donators = new address[](0);
        campaign.donations = new uint256[](0);

        campaign.owner = _owner;
        campaign.title = _title;
        campaign.description = _description;
        campaign.target = _target;
        campaign.deadline = _deadline;
        campaign.amountCollected = 0;
        campaign.image = _image;
        campaign.status = CampaignStatus.Pending;

        numberOfCampaigns++;
        emit CampaignCreated(newCampaignId, _owner);
        return newCampaignId;
    }

    function donateToCampaign(uint256 _id) public payable {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        require(
            campaigns[_id].status == CampaignStatus.Approved,
            "Campaign not approved"
        );
        require(block.timestamp < campaigns[_id].deadline, "Campaign deadline has passed");

        uint256 amount = msg.value;
        Campaign storage campaign = campaigns[_id];

        campaign.donators.push(msg.sender);
        campaign.donations.push(amount);

        (bool sent, ) = payable(campaign.owner).call{value: amount}("");
        if (sent) {
            campaign.amountCollected += amount;
            emit DonationReceived(_id, msg.sender, amount);
        }
    }

    function getDonators(uint256 _id) public view returns (address[] memory, uint256[] memory) {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        return (campaigns[_id].donators, campaigns[_id].donations);
    }

    function approveCampaign(uint256 _id) external onlyRole(ADMIN_ROLE) {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        campaigns[_id].status = CampaignStatus.Approved;
        emit CampaignApproved(_id);
    }

    function rejectCampaign(
        uint256 _id,
        string memory _reason
    ) external onlyRole(ADMIN_ROLE) {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        campaigns[_id].status = CampaignStatus.Rejected;
        campaigns[_id].rejectionReason = _reason;
        emit CampaignRejected(_id, _reason);
    }

    function getCampaigns() public view returns (Campaign[] memory) {
        Campaign[] memory allCampaigns = new Campaign[](numberOfCampaigns);
        for (uint i = 0; i < numberOfCampaigns; i++) {
            Campaign storage item = campaigns[i];
            allCampaigns[i] = item;
        }
        return allCampaigns;
    }

    function getCampaignStatus(uint256 _id) public view returns (CampaignStatus, string memory) {
        require(_id < numberOfCampaigns, "Campaign does not exist");
        return (campaigns[_id].status, campaigns[_id].rejectionReason);
    }
    
    function grantAdminRole(address account) public onlyRole(ADMIN_ROLE) {
        grantRole(ADMIN_ROLE, account);
    }
    
    function revokeAdminRole(address account) public onlyRole(ADMIN_ROLE) {
        revokeRole(ADMIN_ROLE, account);
    }
}