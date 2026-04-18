// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CharityDonationPlatform is Ownable, ReentrancyGuard {
    enum CampaignStatus {
        PENDING_VERIFICATION,
        ACTIVE,
        PAUSED,
        COMPLETED,
        REJECTED
    }

    enum VerificationTier {
        UNVERIFIED,
        SELF_DECLARED,
        NGO_VERIFIED,
        ADMIN_VERIFIED
    }

    enum UpdateType {
        GENERAL_UPDATE,
        PROOF_OF_USE,
        DELIVERY_CONFIRMATION,
        STATUS_CHANGE,
        CLOSURE_PROOF
    }

    struct Campaign {
        uint256 id;
        address creator;
        address beneficiaryWallet;
        string title;
        string descriptionHash;
        string category;
        uint256 targetAmount;
        uint256 raisedAmount;
        uint256 donationCount;
        CampaignStatus status;
        VerificationTier verificationTier;
        uint256 createdAt;
        uint256 verifiedAt;
        uint256 closedAt;
        bytes32 latestProofHash;
    }

    struct Donation {
        uint256 id;
        uint256 campaignId;
        address donor;
        address beneficiaryWallet;
        uint256 amount;
        uint256 timestamp;
    }

    struct CampaignUpdate {
        uint256 id;
        uint256 campaignId;
        address author;
        UpdateType updateType;
        bytes32 detailsHash;
        uint256 timestamp;
    }

    uint256 private nextCampaignId = 1;
    uint256 private nextDonationId = 1;
    uint256 private nextUpdateId = 1;

    mapping(uint256 => Campaign) private campaigns;
    mapping(uint256 => Donation[]) private donationsByCampaign;
    mapping(uint256 => Donation) private donationsById;
    mapping(address => uint256[]) private donationIdsByDonor;
    mapping(uint256 => CampaignUpdate[]) private updatesByCampaign;
    mapping(address => bool) public verifiers;

    event CampaignCreated(
        uint256 indexed campaignId,
        address indexed creator,
        address indexed beneficiaryWallet,
        string title
    );

    event CampaignApproved(uint256 indexed campaignId, uint8 verificationTier);
    event CampaignRejected(uint256 indexed campaignId, bytes32 reasonHash);

    event DonationRecorded(
        uint256 indexed donationId,
        uint256 indexed campaignId,
        address indexed donor,
        address beneficiaryWallet,
        uint256 amount
    );

    event CampaignUpdateAdded(
        uint256 indexed campaignId,
        uint256 indexed updateId,
        uint8 updateType,
        bytes32 detailsHash
    );

    event CampaignPaused(uint256 indexed campaignId, bytes32 reasonHash);
    event CampaignResumed(uint256 indexed campaignId);
    event CampaignCompleted(uint256 indexed campaignId);
    event VerifierUpdated(address indexed verifier, bool allowed);

    error EmptyTitle();
    error EmptyDescriptionHash();
    error EmptyCategory();
    error InvalidBeneficiaryWallet();
    error InvalidTargetAmount();
    error CampaignNotFound(uint256 campaignId);
    error Unauthorized(address caller);
    error InvalidStatus(uint256 campaignId);
    error ZeroDonation();
    error TransferFailed(address recipient, uint256 amount);
    error InvalidProofHash();
    error CampaignNotActive(uint256 campaignId);
    error CampaignAlreadyFinalized(uint256 campaignId);
    error NotCreatorOrVerifier(address caller);

    constructor() Ownable(msg.sender) {}

    modifier onlyOwnerOrVerifier() {
        if (msg.sender != owner() && !verifiers[msg.sender]) {
            revert Unauthorized(msg.sender);
        }
        _;
    }

    modifier onlyCreatorOrOwnerOrVerifier(uint256 campaignId) {
        Campaign storage campaign = _getCampaignStorage(campaignId);
        if (
            msg.sender != campaign.creator &&
            msg.sender != owner() &&
            !verifiers[msg.sender]
        ) {
            revert NotCreatorOrVerifier(msg.sender);
        }
        _;
    }

    function createCampaign(
        string calldata title,
        string calldata descriptionHash,
        string calldata category,
        address beneficiaryWallet,
        uint256 targetAmount,
        bytes32 proofBundleHash
    ) external returns (uint256 campaignId) {
        if (bytes(title).length == 0) {
            revert EmptyTitle();
        }
        if (bytes(descriptionHash).length == 0) {
            revert EmptyDescriptionHash();
        }
        if (bytes(category).length == 0) {
            revert EmptyCategory();
        }
        if (beneficiaryWallet == address(0)) {
            revert InvalidBeneficiaryWallet();
        }
        if (targetAmount == 0) {
            revert InvalidTargetAmount();
        }

        campaignId = nextCampaignId;
        nextCampaignId += 1;

        campaigns[campaignId] = Campaign({
            id: campaignId,
            creator: msg.sender,
            beneficiaryWallet: beneficiaryWallet,
            title: title,
            descriptionHash: descriptionHash,
            category: category,
            targetAmount: targetAmount,
            raisedAmount: 0,
            donationCount: 0,
            status: CampaignStatus.PENDING_VERIFICATION,
            verificationTier: VerificationTier.UNVERIFIED,
            createdAt: block.timestamp,
            verifiedAt: 0,
            closedAt: 0,
            latestProofHash: proofBundleHash
        });

        emit CampaignCreated(campaignId, msg.sender, beneficiaryWallet, title);
    }

    function setVerifier(address verifier, bool allowed) external onlyOwner {
        if (verifier == address(0)) {
            revert Unauthorized(verifier);
        }

        verifiers[verifier] = allowed;
        emit VerifierUpdated(verifier, allowed);
    }

    function approveCampaign(uint256 campaignId, VerificationTier tier) external onlyOwnerOrVerifier {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (
            campaign.status != CampaignStatus.PENDING_VERIFICATION &&
            campaign.status != CampaignStatus.PAUSED
        ) {
            revert InvalidStatus(campaignId);
        }
        if (tier == VerificationTier.UNVERIFIED) {
            revert InvalidStatus(campaignId);
        }

        campaign.status = CampaignStatus.ACTIVE;
        campaign.verificationTier = tier;
        campaign.verifiedAt = block.timestamp;

        emit CampaignApproved(campaignId, uint8(tier));
    }

    function rejectCampaign(uint256 campaignId, bytes32 reasonHash) external onlyOwnerOrVerifier {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (
            campaign.status != CampaignStatus.PENDING_VERIFICATION &&
            campaign.status != CampaignStatus.PAUSED
        ) {
            revert InvalidStatus(campaignId);
        }

        campaign.status = CampaignStatus.REJECTED;
        emit CampaignRejected(campaignId, reasonHash);
    }

    function pauseCampaign(uint256 campaignId, bytes32 reasonHash) external onlyOwnerOrVerifier {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (campaign.status != CampaignStatus.ACTIVE) {
            revert InvalidStatus(campaignId);
        }

        campaign.status = CampaignStatus.PAUSED;
        emit CampaignPaused(campaignId, reasonHash);
    }

    function resumeCampaign(uint256 campaignId) external onlyOwnerOrVerifier {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (campaign.status != CampaignStatus.PAUSED) {
            revert InvalidStatus(campaignId);
        }

        campaign.status = CampaignStatus.ACTIVE;
        emit CampaignResumed(campaignId);
    }

    function donateToCampaign(uint256 campaignId) external payable nonReentrant returns (uint256 donationId) {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (campaign.status != CampaignStatus.ACTIVE) {
            revert CampaignNotActive(campaignId);
        }
        if (msg.value == 0) {
            revert ZeroDonation();
        }
        if (campaign.beneficiaryWallet == address(0)) {
            revert InvalidBeneficiaryWallet();
        }

        donationId = nextDonationId;
        nextDonationId += 1;

        Donation memory donation = Donation({
            id: donationId,
            campaignId: campaignId,
            donor: msg.sender,
            beneficiaryWallet: campaign.beneficiaryWallet,
            amount: msg.value,
            timestamp: block.timestamp
        });

        donationsByCampaign[campaignId].push(donation);
        donationsById[donationId] = donation;
        donationIdsByDonor[msg.sender].push(donationId);

        campaign.raisedAmount += msg.value;
        campaign.donationCount += 1;

        (bool success, ) = payable(campaign.beneficiaryWallet).call{value: msg.value}("");
        if (!success) {
            revert TransferFailed(campaign.beneficiaryWallet, msg.value);
        }

        emit DonationRecorded(
            donationId,
            campaignId,
            msg.sender,
            campaign.beneficiaryWallet,
            msg.value
        );
    }

    function addCampaignUpdate(
        uint256 campaignId,
        UpdateType updateType,
        bytes32 detailsHash
    ) external onlyCreatorOrOwnerOrVerifier(campaignId) returns (uint256 updateId) {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (detailsHash == bytes32(0)) {
            revert InvalidProofHash();
        }
        if (
            campaign.status == CampaignStatus.COMPLETED ||
            campaign.status == CampaignStatus.REJECTED
        ) {
            revert InvalidStatus(campaignId);
        }

        updateId = nextUpdateId;
        nextUpdateId += 1;

        CampaignUpdate memory campaignUpdate = CampaignUpdate({
            id: updateId,
            campaignId: campaignId,
            author: msg.sender,
            updateType: updateType,
            detailsHash: detailsHash,
            timestamp: block.timestamp
        });

        updatesByCampaign[campaignId].push(campaignUpdate);
        campaign.latestProofHash = detailsHash;

        emit CampaignUpdateAdded(campaignId, updateId, uint8(updateType), detailsHash);
    }

    function completeCampaign(uint256 campaignId) external onlyCreatorOrOwnerOrVerifier(campaignId) {
        Campaign storage campaign = _getCampaignStorage(campaignId);

        if (
            campaign.status == CampaignStatus.COMPLETED ||
            campaign.status == CampaignStatus.REJECTED
        ) {
            revert CampaignAlreadyFinalized(campaignId);
        }

        campaign.status = CampaignStatus.COMPLETED;
        campaign.closedAt = block.timestamp;

        emit CampaignCompleted(campaignId);
    }

    function getCampaign(uint256 campaignId) external view returns (Campaign memory) {
        Campaign memory campaign = campaigns[campaignId];
        if (campaign.id == 0) {
            revert CampaignNotFound(campaignId);
        }

        return campaign;
    }

    function getCampaignCount() external view returns (uint256) {
        return nextCampaignId - 1;
    }

    function getCampaignDonations(uint256 campaignId) external view returns (Donation[] memory) {
        _requireCampaignExists(campaignId);
        return donationsByCampaign[campaignId];
    }

    function getCampaignUpdates(uint256 campaignId) external view returns (CampaignUpdate[] memory) {
        _requireCampaignExists(campaignId);
        return updatesByCampaign[campaignId];
    }

    function getDonationsByDonor(address donor) external view returns (Donation[] memory donorDonations) {
        uint256[] storage donationIds = donationIdsByDonor[donor];
        donorDonations = new Donation[](donationIds.length);

        for (uint256 index = 0; index < donationIds.length; index += 1) {
            donorDonations[index] = donationsById[donationIds[index]];
        }
    }

    function _requireCampaignExists(uint256 campaignId) internal view {
        if (campaigns[campaignId].id == 0) {
            revert CampaignNotFound(campaignId);
        }
    }

    function _getCampaignStorage(uint256 campaignId) internal view returns (Campaign storage campaign) {
        campaign = campaigns[campaignId];
        if (campaign.id == 0) {
            revert CampaignNotFound(campaignId);
        }
    }
}
