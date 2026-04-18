# PRD Requirements Checklist

## Roles

- [x] owner/admin role exists
- [x] verifier role exists
- [x] campaign creator role behaviors exist
- [x] donor role behaviors exist
- [x] beneficiary direct fund receipt is preserved

## Enums

- [x] `CampaignStatus`
- [x] `VerificationTier`
- [x] `UpdateType`

## Core Entities

### Campaign
- [x] `campaignId`
- [x] `creator`
- [x] `beneficiaryWallet`
- [x] `title`
- [x] `descriptionHash`
- [x] `category`
- [x] `targetAmount`
- [x] `raisedAmount`
- [x] `donationCount`
- [x] `status`
- [x] `verificationTier`
- [x] `createdAt`
- [x] `verifiedAt`
- [x] `closedAt`
- [x] `latestProofHash`

### Donation
- [x] `donationId`
- [x] `campaignId`
- [x] `donor`
- [x] `beneficiaryWallet`
- [x] `amount`
- [x] `timestamp`

### Campaign Update
- [x] `updateId`
- [x] `campaignId`
- [x] `author`
- [x] `updateType`
- [x] `detailsHash`
- [x] `timestamp`

## Required Contract Flows

- [x] create campaign
- [x] approve campaign
- [x] reject campaign
- [x] pause campaign
- [x] resume campaign
- [x] donate to campaign
- [x] direct ETH forwarding to beneficiary
- [x] add campaign update
- [x] complete campaign

## Required View Functions

- [x] `getCampaign(uint256 campaignId)`
- [x] `getCampaignCount()`
- [x] `getCampaignDonations(uint256 campaignId)`
- [x] `getCampaignUpdates(uint256 campaignId)`
- [x] `getDonationsByDonor(address donor)`

## Required Events

- [x] `CampaignCreated`
- [x] `CampaignApproved`
- [x] `CampaignRejected`
- [x] `DonationRecorded`
- [x] `CampaignUpdateAdded`
- [x] `CampaignPaused`
- [x] `CampaignResumed`
- [x] `CampaignCompleted`
- [x] `VerifierUpdated`

## Required Custom Errors

- [x] `EmptyTitle`
- [x] `EmptyDescriptionHash`
- [x] `InvalidBeneficiaryWallet`
- [x] `InvalidTargetAmount`
- [x] `CampaignNotFound`
- [x] `Unauthorized`
- [x] `InvalidStatus`
- [x] `ZeroDonation`
- [x] `TransferFailed`
- [x] `InvalidProofHash`

Optional PRD-permitted errors:
- [x] `CampaignNotActive`
- [x] `CampaignAlreadyFinalized`
- [x] `NotCreatorOrVerifier`

## Acceptance Criteria Mapping

### Contract
- [x] campaign creation works
- [x] invalid campaign inputs revert
- [x] verifier or admin approval and rejection are restricted
- [x] only active campaigns accept donations
- [x] donation amount must be greater than zero
- [x] donations are stored immutably
- [x] ETH is forwarded to beneficiary
- [x] raised amount updates correctly
- [x] donation count updates correctly
- [x] proof updates are authorized only
- [x] pause blocks donations
- [x] resume re-enables donations
- [x] completed campaigns block donations
- [x] view functions return correct data

### Frontend
- [ ] MetaMask connect
- [ ] wrong-network handling
- [x] campaign creation form
- [x] campaign listing
- [x] campaign detail page
- [x] donate action and totals refresh
- [x] donation receipt
- [x] proof timeline
- [x] verifier action visibility
- [x] donor dashboard
- [x] loading and error states

## Demo Requirements

- [ ] start Ganache
- [ ] compile and migrate
- [ ] start frontend
- [ ] connect admin/verifier wallet
- [ ] create campaign
- [ ] approve campaign
- [x] donate
- [ ] show immutable donation history
- [x] show beneficiary received ETH
- [ ] add proof update
- [ ] show proof timeline
- [ ] pause and resume
- [ ] complete campaign
- [ ] show donor dashboard and platform metrics

## Documented Interpretation Decisions

- [x] Optional `proofBundleHash` at creation initializes `latestProofHash` when provided.
- [x] Beneficiary direct update permissions remain optional and will not be added unless required in later PRD alignment review.

Frontend implementation note:
- [x] Phase 7 list, create, and detail routes are implemented and build-validated; browser-side MetaMask verification remains tracked in `docs/TEST_PLAN.md`.
- [x] Phase 8 donation form, donor receipt, and donor dashboard routes are implemented and build-validated; browser-side transaction confirmation remains tracked in `docs/TEST_PLAN.md`.
- [x] Phase 9 verifier/admin control routes are implemented and build-validated; browser-side privileged action confirmation remains tracked in `docs/TEST_PLAN.md`.
