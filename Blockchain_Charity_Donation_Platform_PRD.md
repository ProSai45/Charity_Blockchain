# Blockchain-Based Charity Donation Platform — Product Requirements Document (PRD)

**Version:** 1.0  
**Status:** Approved for implementation  
**Primary stack:** Ganache + Truffle + Solidity + React + MetaMask  
**Target OS:** Ubuntu Linux  
**Document purpose:** This PRD is the single source of truth for building the project end-to-end in Codex or manually.

---

## 1. Executive Summary

The **Blockchain-Based Charity Donation Platform** is a transparent donation-tracking decentralized application built for local development and demonstration using **Ganache**, **Truffle**, **Solidity**, and a **React frontend** connected through **MetaMask**.

The platform solves a common trust problem in charity and beneficiary support systems: donors often do not know where their money went, whether the request was legitimate, or what impact their donation had.

This product allows:
- verified charities or verified aid request creators to register donation campaigns,
- donors to contribute ETH directly to the beneficiary wallet through a smart contract,
- every donation to be recorded immutably on-chain,
- donors to track campaign status and proof-of-impact updates,
- the platform to demonstrate legitimacy checks and anti-fraud mechanisms in a clear, explainable way.

The design must be:
- demo-friendly
- transparent
- student-project realistic
- strictly testable on Ganache
- easy to build incrementally with Codex

---

## 2. Problem Statement

Traditional donation systems suffer from four major issues:

1. **Lack of transparency**  
   Donors often cannot trace how funds moved or whether the intended recipient actually received them.

2. **Low trust in legitimacy**  
   Donors may worry that campaigns, beneficiary claims, or charitable organizations are fake or misleading.

3. **Weak accountability after donation**  
   Even if funds are sent, donors usually do not get a structured record of status updates, proof of delivery, or evidence of usage.

4. **Poor auditability**  
   Donation history is often fragmented across web portals, spreadsheets, payment gateways, or manual records.

This project addresses these issues by making donation flow, campaign approval state, transaction history, and proof updates visible and immutable.

---

## 3. Product Vision

Build a transparent donation platform where donors can:
- discover verified campaigns,
- donate safely,
- see immutable donation records,
- inspect verification level and proof hashes,
- follow a structured donation journey from request creation to proof update to closure.

The platform should feel like a credible prototype that could later evolve into a real humanitarian transparency system.

---

## 4. Project Goals

### 4.1 Primary goals
1. Build a working smart contract that records donations immutably and forwards ETH directly to the recipient wallet.
2. Provide a legitimacy-check workflow for campaigns and beneficiaries.
3. Create a donor-facing React application with wallet connection, campaign listing, donation flow, and tracking.
4. Demonstrate transparent lifecycle tracking of requests and donations.
5. Build the solution locally using Ganache + Truffle and make it easy to demo on Ubuntu.

### 4.2 Secondary goals
1. Add differentiating features that make the project stand out in a presentation.
2. Keep the architecture simple enough for a student project while still feeling complete.
3. Provide documentation strong enough for Codex to use as a build specification.

---

## 5. Non-Goals

The following are **not part of the MVP** unless explicitly added later:

- public mainnet/testnet deployment,
- real bank integrations,
- real-world KYC APIs,
- mobile app development,
- AI-based fraud detection in production,
- advanced DAO governance,
- automatic legal compliance handling,
- fiat payments,
- decentralized identity integrations beyond placeholder proof hashes,
- production-grade privacy architecture.

These may be mentioned as future work but must not block implementation.

---

## 6. Users and Personas

### 6.1 Donor
A person with a wallet who wants to contribute funds and track impact.

**Needs**
- discover trustworthy campaigns,
- see campaign purpose and status,
- donate safely,
- know funds reached the correct wallet,
- review donation history and updates.

### 6.2 Beneficiary
A person or entity receiving aid through a campaign.

**Needs**
- receive funds directly,
- have a campaign associated with their wallet,
- upload or request proof metadata via hashes,
- gain donor trust through transparent records.

### 6.3 Charity / Organization
A registered organization that creates or manages donation campaigns on behalf of beneficiaries.

**Needs**
- register campaigns,
- attach beneficiary wallet and proof hashes,
- publish updates,
- gain credibility via verification.

### 6.4 Platform Verifier / Admin
A role used in the local prototype to validate campaigns and reduce fraud.

**Needs**
- review campaign metadata,
- approve or reject campaigns,
- assign verification level,
- pause suspicious campaigns.

### 6.5 Project Evaluator
Faculty, reviewer, or demo audience.

**Needs**
- a clear use case,
- visible anti-fraud logic,
- obvious donation traceability,
- easy setup and reproducible demo steps,
- clean handling of edge cases.

---

## 7. Product Principles

1. **Transparency first**  
   All important donation and campaign state changes must be visible on-chain.

2. **Funds move directly to the beneficiary**  
   The contract records donations and forwards the ETH directly to the recipient wallet in the same flow.

3. **Legitimacy should be explainable**  
   Even if verification uses off-chain review, the decision and evidence references must be recorded clearly.

4. **Immutable history matters**  
   Donations, approvals, rejections, status changes, and proof updates must be easy to retrieve.

5. **Demo clarity over unnecessary complexity**  
   The system should be strong enough to impress, but simple enough to finish and explain.

---

## 8. Scope Summary

### 8.1 Mandatory core scope
The platform must support:
1. campaign creation for donation requests,
2. legitimacy or verification workflow,
3. ETH donation through a smart contract,
4. direct forwarding of ETH to the beneficiary wallet,
5. immutable donation record storage,
6. donor-facing interface for campaign discovery and donation tracking,
7. donation status or proof updates visible to donors,
8. local deployment on Ganache with Truffle and MetaMask.

### 8.2 Recommended MVP scope definition
To keep implementation realistic, MVP will focus on:
- money donations only,
- campaign verification tiers,
- proof and status updates using hashes,
- donation timeline visibility,
- donor tracking dashboard.

### 8.3 Optional stretch scope
After MVP is stable, optional differentiating features may include:
- item donation pledge tracking,
- donor impact badges,
- urgency scoring,
- campaign reputation analytics,
- proof update timeline visualization,
- receipt export.

---

## 9. Recommended Product Positioning

The platform should be presented as:

> A transparent blockchain-based donation tracking platform where verified campaigns receive direct wallet-to-wallet support, and donors can track legitimacy, donation records, and proof updates through an immutable audit trail.

---

## 10. Differentiating Features

### 10.1 Verification Tier System
Every campaign displays a clear verification level:
- Unverified
- Self-Declared
- NGO-Verified
- Admin/Verifier Approved

This is recorded on-chain and visible in the UI.

### 10.2 Direct-to-Beneficiary ETH Flow
Donations do not sit in a pooled treasury for MVP.  
Instead, the contract:
1. validates the donation,
2. records it immutably,
3. forwards ETH directly to the beneficiary wallet.

### 10.3 Proof-of-Impact Timeline
Campaign creators or authorized organizations can post update hashes representing:
- proof of delivery,
- medical bill proof,
- item purchase proof,
- beneficiary acknowledgment,
- campaign closure proof.

These updates appear in a visible timeline on the frontend.

### 10.4 Donor Impact Receipt
After a successful donation, the frontend shows a structured receipt:
- donor wallet,
- beneficiary wallet,
- campaign title,
- amount donated,
- timestamp,
- transaction hash,
- current verification tier.

### 10.5 Trust Dashboard
Each campaign card shows:
- verification tier,
- amount raised,
- donation count,
- latest proof update,
- campaign status,
- beneficiary wallet snippet.

### 10.6 Immutable Campaign Status Trail
Every approval, rejection, proof update, pause, resume, or closure event is logged and can be viewed as a lifecycle trail.

---

## 11. Product Scope by Release

### 11.1 MVP (must build)
- campaign registration
- beneficiary wallet association
- verifier/admin approval flow
- donor donation flow
- immutable donation storage
- direct ETH forwarding
- update/proof timeline
- React UI
- Ganache + Truffle + MetaMask workflow
- clear documentation and demo guide

### 11.2 V1.1 stretch
- item donation pledge records
- urgency or priority filters
- donor-specific dashboard history
- downloadable donation receipt
- richer analytics charts

---

## 12. Functional Model

A campaign represents a donation request associated with:
- a creator,
- a beneficiary wallet,
- a description hash,
- a target amount,
- a verification tier,
- a status,
- a history of proof or status updates,
- a transparent list of donations.

Donors browse active campaigns and send ETH. The contract records the donation and immediately forwards the ETH to the beneficiary wallet.

---

## 13. Roles and Permissions

### 13.1 Platform Admin
Permissions:
- set or update verifier addresses,
- pause or unpause suspicious campaigns,
- approve or reject campaign submissions,
- assign verification tier.

For MVP, a single admin/verifier role is acceptable.

### 13.2 Campaign Creator
Permissions:
- create campaigns,
- edit limited metadata before verification if implemented,
- publish proof or status updates,
- close campaign when completed.

### 13.3 Beneficiary Wallet
Permissions:
- receive funds,
- optionally acknowledge completion via hash update if implemented.

### 13.4 Donor
Permissions:
- donate to open, approved campaigns,
- view campaign status and personal donation history.

---

## 14. Core Entities

### 14.1 Campaign
Required fields:
- `campaignId`
- `creator`
- `beneficiaryWallet`
- `title`
- `descriptionHash`
- `category`
- `targetAmount`
- `raisedAmount`
- `donationCount`
- `status`
- `verificationTier`
- `createdAt`
- `verifiedAt`
- `closedAt`
- `latestProofHash`

### 14.2 Donation
Required fields:
- `donationId`
- `campaignId`
- `donor`
- `beneficiaryWallet`
- `amount`
- `timestamp`

### 14.3 Campaign Update
Required fields:
- `updateId`
- `campaignId`
- `author`
- `updateType`
- `detailsHash`
- `timestamp`

---

## 15. Lifecycle Design

### 15.1 Campaign Status Enum
Use the following states:

```solidity
enum CampaignStatus {
    PENDING_VERIFICATION,
    ACTIVE,
    PAUSED,
    COMPLETED,
    REJECTED
}
```

### Meaning
- `PENDING_VERIFICATION`: submitted, waiting for verifier decision
- `ACTIVE`: approved and accepting donations
- `PAUSED`: temporarily blocked
- `COMPLETED`: closed after reaching goal or manual closure
- `REJECTED`: failed legitimacy review

### 15.2 Verification Tier Enum
```solidity
enum VerificationTier {
    UNVERIFIED,
    SELF_DECLARED,
    NGO_VERIFIED,
    ADMIN_VERIFIED
}
```

### 15.3 Update Type Enum
```solidity
enum UpdateType {
    GENERAL_UPDATE,
    PROOF_OF_USE,
    DELIVERY_CONFIRMATION,
    STATUS_CHANGE,
    CLOSURE_PROOF
}
```

---

## 16. Legitimacy / Anti-Fraud Design

This is a required part of the project.

### 16.1 MVP Legitimacy Strategy
Use a hybrid verification model.

#### Off-chain review
The verifier reviews:
- organization documents,
- identity proof,
- beneficiary proof,
- photos or bill references,
- proof bundle uploaded elsewhere.

#### On-chain record
The contract stores:
- campaign approval status,
- verification tier,
- proof bundle hash,
- reviewer decision hash if needed.

### 16.2 Recommended verification logic
A campaign can become `ACTIVE` only if:
1. beneficiary wallet is present,
2. title and description hash are present,
3. target amount > 0,
4. verifier/admin approves the campaign,
5. verification tier is assigned.

### 16.3 Optional low-risk anti-fraud differentiators
- Campaign freeze
- Reason hash for pause or rejection
- Authorized-only proof updates
- Proof freshness indicator in UI

---

## 17. Functional Requirements

### 17.1 Create Campaign
Inputs:
- `title` (required)
- `descriptionHash` (required)
- `category` (required)
- `beneficiaryWallet` (required)
- `targetAmount` (required, > 0)
- optional `proofBundleHash`

Rules:
1. Title must not be empty.
2. Description hash must not be empty.
3. Beneficiary wallet must not be zero address.
4. Target amount must be greater than zero.
5. New campaigns start as `PENDING_VERIFICATION`.
6. Raised amount starts at zero.
7. Donation count starts at zero.

Event:
`CampaignCreated(uint256 indexed campaignId, address indexed creator, address indexed beneficiaryWallet, string title)`

### 17.2 Approve / Verify Campaign
Rules:
1. Only admin/verifier may approve or reject.
2. Campaign must exist.
3. Campaign must be in `PENDING_VERIFICATION` or `PAUSED` when appropriate.
4. On approval:
   - status becomes `ACTIVE`
   - verification tier is assigned
   - verified timestamp is stored
5. On rejection:
   - status becomes `REJECTED`

Events:
- `CampaignApproved(uint256 indexed campaignId, VerificationTier tier)`
- `CampaignRejected(uint256 indexed campaignId, bytes32 reasonHash)`

### 17.3 Donate to Campaign
Rules:
1. Campaign must exist.
2. Campaign must be `ACTIVE`.
3. Donation amount must be greater than zero.
4. Beneficiary wallet must be valid.
5. Donation metadata must be recorded.
6. ETH must be forwarded to the beneficiary wallet.
7. Raised amount and donation count must update.

MVP recommendation:
- donations are allowed while status is `ACTIVE`,
- if `raisedAmount >= targetAmount`, frontend shows Goal Reached,
- creator or verifier can later mark `COMPLETED`.

Event:
`DonationRecorded(uint256 indexed donationId, uint256 indexed campaignId, address indexed donor, address beneficiaryWallet, uint256 amount)`

### 17.4 Publish Proof / Status Update
Allowed authors:
- campaign creator
- admin/verifier
- optionally beneficiary if implemented

Rules:
1. Campaign must exist.
2. Update hash must not be empty.
3. Only authorized roles may add updates.
4. Update is appended immutably.
5. Latest proof hash is updated.

Event:
`CampaignUpdateAdded(uint256 indexed campaignId, uint256 indexed updateId, UpdateType updateType, bytes32 detailsHash)`

### 17.5 Pause Campaign
Rules:
1. Only admin/verifier may pause.
2. Only `ACTIVE` campaigns can be paused.
3. Donations must be blocked while paused.

Event:
`CampaignPaused(uint256 indexed campaignId, bytes32 reasonHash)`

### 17.6 Resume Campaign
Rules:
1. Only admin/verifier may resume.
2. Campaign must be `PAUSED`.
3. It returns to `ACTIVE`.

Event:
`CampaignResumed(uint256 indexed campaignId)`

### 17.7 Close Campaign
Rules:
1. Campaign must exist.
2. Caller must be creator or admin/verifier.
3. Campaign must not already be `COMPLETED` or `REJECTED`.
4. Status becomes `COMPLETED`.
5. Closed timestamp is stored.

Event:
`CampaignCompleted(uint256 indexed campaignId)`

### 17.8 View Functions
Required:
- `getCampaign(uint256 campaignId)`
- `getCampaignCount()`
- `getCampaignDonations(uint256 campaignId)`
- `getCampaignUpdates(uint256 campaignId)`
- `getDonationsByDonor(address donor)`

---

## 18. Smart Contract Design

### 18.1 Solidity Version
```solidity
pragma solidity ^0.8.20;
```

### 18.2 Contract choice
For MVP, use a single main contract:
- `CharityDonationPlatform.sol`

### 18.3 Library usage
Use OpenZeppelin for:
- `Ownable`
- `ReentrancyGuard`

### 18.4 ETH flow model
When a donor donates:
1. validate campaign state,
2. record donation data,
3. update campaign totals,
4. forward ETH to beneficiary wallet using `call`,
5. revert if transfer fails.

---

## 19. Suggested Data Model

### 19.1 Campaign struct
```solidity
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
```

### 19.2 Donation struct
```solidity
struct Donation {
    uint256 id;
    uint256 campaignId;
    address donor;
    address beneficiaryWallet;
    uint256 amount;
    uint256 timestamp;
}
```

### 19.3 Campaign update struct
```solidity
struct CampaignUpdate {
    uint256 id;
    uint256 campaignId;
    address author;
    UpdateType updateType;
    bytes32 detailsHash;
    uint256 timestamp;
}
```

### 19.4 Storage mappings
```solidity
uint256 private nextCampaignId;
uint256 private nextDonationId;
uint256 private nextUpdateId;

mapping(uint256 => Campaign) private campaigns;
mapping(uint256 => Donation[]) private donationsByCampaign;
mapping(address => uint256[]) private donationIdsByDonor;
mapping(uint256 => CampaignUpdate[]) private updatesByCampaign;
mapping(address => bool) public verifiers;
```

---

## 20. Required Events

```solidity
event CampaignCreated(
    uint256 indexed campaignId,
    address indexed creator,
    address indexed beneficiaryWallet,
    string title
);

event CampaignApproved(
    uint256 indexed campaignId,
    uint8 verificationTier
);

event CampaignRejected(
    uint256 indexed campaignId,
    bytes32 reasonHash
);

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

event CampaignPaused(
    uint256 indexed campaignId,
    bytes32 reasonHash
);

event CampaignResumed(
    uint256 indexed campaignId
);

event CampaignCompleted(
    uint256 indexed campaignId
);

event VerifierUpdated(
    address indexed verifier,
    bool allowed
);
```

---

## 21. Custom Errors

```solidity
error EmptyTitle();
error EmptyDescriptionHash();
error InvalidBeneficiaryWallet();
error InvalidTargetAmount();
error CampaignNotFound(uint256 campaignId);
error Unauthorized(address caller);
error InvalidStatus(uint256 campaignId);
error ZeroDonation();
error TransferFailed(address recipient, uint256 amount);
error InvalidProofHash();
```

Optional additional errors:
```solidity
error CampaignNotActive(uint256 campaignId);
error CampaignAlreadyFinalized(uint256 campaignId);
error NotCreatorOrVerifier(address caller);
```

---

## 22. Security Considerations

1. Use `nonReentrant` on donation functions.
2. Follow checks-effects-interactions pattern.
3. Validate campaign state before external transfers.
4. Revert if forwarding ETH fails.
5. Restrict privileged functions to owner/verifier roles.
6. Avoid unnecessary public mutable state.
7. Use Ganache EOAs in demo to reduce transfer unpredictability.

---

## 23. Frontend Product Requirements

### 23.1 Frontend stack
Use:
- React
- Vite
- ethers.js
- React Router
- Tailwind CSS or simple CSS modules

Recommendation: React + Vite + ethers.js + Tailwind CSS.

---

## 24. Frontend Pages

### 24.1 Dashboard / Home
Sections:
- Navbar
- Wallet connection panel
- Network banner
- Campaign filter/search bar
- Campaign cards grid
- Recent platform activity timeline

### 24.2 Campaign Detail Page
Sections:
- Campaign header
- Beneficiary info
- Verification badge
- Donation form
- Funding progress
- Proof timeline
- Donation history summary
- Admin actions if wallet is verifier

### 24.3 Donor Dashboard
Purpose:
- supported campaigns,
- donation receipts,
- total donated amount,
- latest updates on supported campaigns.

### 24.4 Admin / Verifier Panel
Purpose:
- view pending campaigns,
- approve/reject/pause/resume,
- add verification decisions.

---

## 25. Frontend Components

Recommended components:
- `Navbar`
- `WalletConnector`
- `NetworkBanner`
- `CampaignCard`
- `CampaignGrid`
- `CampaignFilters`
- `CreateCampaignForm`
- `CampaignDetails`
- `DonationForm`
- `ProofTimeline`
- `DonationReceipt`
- `DonorHistory`
- `VerifierPanel`
- `StatusBadge`
- `MetricsStrip`

---

## 26. Frontend Display Requirements

Every campaign card must show:
- title
- category
- beneficiary address snippet
- target amount
- raised amount
- percent funded
- status
- verification tier
- donation count
- latest proof availability

Campaign detail page must show:
- full title
- full description hash
- creator address
- beneficiary wallet
- created date
- verified date if any
- proof timeline
- donate button
- admin actions where authorized

---

## 27. UX Rules

1. Disable donate button if:
   - wallet not connected,
   - wrong network,
   - campaign not active,
   - donation amount invalid.

2. Disable admin actions if:
   - wallet lacks permission.

3. Show clear pending state for transactions:
   - awaiting MetaMask confirmation,
   - transaction submitted,
   - transaction mined,
   - transaction failed.

4. Refresh campaign data after every write operation.

5. Error messages must be human-readable.

---

## 28. Differentiating UI Features

### 28.1 Verification Badge Strip
Campaign cards and detail pages show a prominent badge:
- Unverified
- Self-Declared
- NGO-Verified
- Admin-Verified

### 28.2 Proof Freshness Indicator
Show:
- “No updates yet”
- “Updated today”
- “Updated X days ago”

### 28.3 Donation Journey Timeline
For each campaign show a visual timeline:
- created
- verified
- donated
- proof added
- completed

### 28.4 Donor Receipt View
A popup or section after donation:
- amount
- campaign
- beneficiary
- tx hash
- date
- verification level

### 28.5 Impact Overview Widget
Display:
- total campaigns
- active campaigns
- total ETH donated
- total donation count

---

## 29. Required Ubuntu / Linux Setup Guide

### 29.1 Base package install
```bash
sudo apt update
sudo apt install -y curl git build-essential
```

### 29.2 Install Node.js using NVM
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
node -v
npm -v
```

### 29.3 Install Truffle
```bash
npm install -g truffle
truffle version
```

### 29.4 Install Ganache CLI
```bash
npm install -g ganache
ganache --version
```

### 29.5 Start Ganache
```bash
ganache --wallet.totalAccounts 20 --wallet.defaultBalance 1000 --chain.chainId 1337 --server.host 127.0.0.1 --server.port 8545
```

### 29.6 Configure MetaMask
Add a custom network:
- Network name: `Ganache Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `1337`
- Currency symbol: `ETH`

Import several Ganache accounts:
- one admin/verifier
- one campaign creator
- one beneficiary
- several donors

---

## 30. Repository Structure

```text
charity-donation-platform/
├── contracts/
│   └── CharityDonationPlatform.sol
├── migrations/
│   ├── 1_initial_migration.js
│   └── 2_deploy_charity_donation_platform.js
├── test/
│   └── CharityDonationPlatform.test.js
├── client/
│   ├── src/
│   │   ├── abi/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── docs/
│   ├── PRD.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── TEST_PLAN.md
│   ├── DEMO_GUIDE.md
│   └── ARCHITECTURE.md
├── truffle-config.js
├── package.json
└── README.md
```

---

## 31. Truffle Setup Requirements

### 31.1 Initialize project
```bash
mkdir charity-donation-platform
cd charity-donation-platform
truffle init
npm init -y
npm install @openzeppelin/contracts
```

### 31.2 Configure `truffle-config.js`
```javascript
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.20",
    },
  },
};
```

### 31.3 Compile and migrate
```bash
truffle compile
truffle migrate --network development --reset
```

---

## 32. React Frontend Setup Requirements

### 32.1 Create frontend
```bash
npm create vite@latest client -- --template react
cd client
npm install
npm install ethers react-router-dom
```

Optional styling:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 32.2 ABI and contract config integration
After deploying:
- copy the compiled ABI JSON into `client/src/abi/`
- define deployed contract address in a config file

Suggested file:
- `client/src/utils/contractConfig.js`

### 32.3 Run frontend
```bash
npm run dev
```

---

## 33. Implementation Plan by Phase

### Phase 0 — Planning and documentation
Deliverables:
- repo structure
- PRD-derived checklist
- docs scaffolding
- implementation plan
- architecture notes

### Phase 1 — Contract core
Deliverables:
- contract skeleton
- roles
- campaign creation
- view methods for campaign data

### Phase 2 — Verification workflow
Deliverables:
- verifier role management
- approve/reject/pause/resume
- status transitions
- tests for privileged actions

### Phase 3 — Donation flow
Deliverables:
- donation recording
- direct ETH forwarding
- raised amount updates
- donor history mapping
- tests for successful donation and transfer

### Phase 4 — Proof updates and history
Deliverables:
- update timeline
- proof hash publishing
- read functions for updates

### Phase 5 — Frontend MVP
Deliverables:
- wallet connect
- dashboard
- create campaign form
- campaign list
- campaign detail page
- donate flow

### Phase 6 — Admin and donor dashboards
Deliverables:
- verifier panel
- donor donation history
- proof freshness UI
- receipt view

### Phase 7 — Final polish
Deliverables:
- README
- DEMO_GUIDE
- TEST_PLAN
- architecture doc
- screenshots if desired

---

## 34. Contract Acceptance Criteria

The smart contract is complete only if:
1. Campaign creation works for valid input.
2. Empty title is rejected.
3. Empty description hash is rejected.
4. Zero beneficiary wallet is rejected.
5. Zero target amount is rejected.
6. Only owner/admin/verifier can approve or reject.
7. Only active campaigns accept donations.
8. Donation amount must be greater than zero.
9. Donation gets recorded immutably.
10. ETH is forwarded to beneficiary wallet.
11. Raised amount updates correctly.
12. Donation count updates correctly.
13. Proof updates can be added only by authorized roles.
14. Pause blocks new donations.
15. Resume re-enables donations.
16. Completed campaigns stop accepting donations.
17. View functions return correct data.

---

## 35. Frontend Acceptance Criteria

The frontend is complete only if:
1. MetaMask connect works.
2. Wrong-network detection works.
3. Campaign creation form works.
4. Campaign listing works.
5. Campaign detail page loads correct data.
6. Donate action works and updates visible totals.
7. Donation receipt is shown.
8. Proof timeline is visible.
9. Admin/verifier actions are visible only to the right role.
10. Donor dashboard shows donation history.
11. Loading, success, and failure states are visible.
12. End-to-end demo is smooth on Ganache.

---

## 36. Test Plan

### 36.1 Contract unit tests
Write Truffle tests for:
- valid campaign creation,
- empty title rejection,
- empty description hash rejection,
- invalid beneficiary rejection,
- invalid target rejection,
- verifier-only approval/rejection,
- approval status change,
- rejection status change,
- pause and resume,
- donation to active campaign succeeds,
- donation to invalid states fails,
- zero donation fails,
- donation updates raised amount,
- donation updates count,
- donation record stored,
- beneficiary wallet receives ETH,
- authorized update succeeds,
- unauthorized update fails,
- latest proof hash updates,
- campaign close works,
- completed campaign blocks donation.

### 36.2 Frontend manual test checklist
1. Connect MetaMask.
2. Confirm correct network banner.
3. Create campaign.
4. Switch to verifier wallet.
5. Approve campaign.
6. Switch to donor wallet.
7. Donate ETH.
8. Verify beneficiary balance increases in Ganache.
9. Verify donation shows in UI.
10. Add proof update.
11. Confirm timeline updates.
12. Pause campaign and verify donate is blocked.
13. Resume and donate again.
14. Complete campaign and verify donations stop.

---

## 37. Demo Guide Requirements

The final build must support a demo in this order:
1. Start Ganache.
2. Compile and migrate contract with Truffle.
3. Start React frontend.
4. Connect admin/verifier wallet.
5. Connect creator wallet and create a campaign.
6. Switch back to verifier and approve the campaign.
7. Switch to donor wallet and donate ETH.
8. Show immutable donation history.
9. Show beneficiary wallet received ETH.
10. Add proof update.
11. Show proof timeline.
12. Pause and resume a campaign.
13. Close the campaign.
14. Show donor dashboard and platform statistics.

---

## 38. Risk Register

### Risk 1 — MetaMask / Ganache network mismatch
Mitigation: show current chain ID in UI and disable transactions on wrong network.

### Risk 2 — Contract address drift after redeploy
Mitigation: store contract address in one config file and update it after migration.

### Risk 3 — Failed ETH forwarding
Mitigation: use `call`, revert on failure, and keep the demo on EOA wallets.

### Risk 4 — Overly complex verification design
Mitigation: use simple admin/verifier role in MVP and record proof hashes instead of trying to automate real KYC.

### Risk 5 — UI stale state
Mitigation: refetch all relevant data after confirmed transactions.

---

## 39. Git and Documentation Requirements

Use Git from the start.

Suggested branches:
- `main`
- `feature/contract-core`
- `feature/verification-flow`
- `feature/donation-flow`
- `feature/frontend-mvp`
- `feature/demo-polish`

Suggested commit style:
- `feat(contract): add campaign creation`
- `feat(contract): add verifier approval flow`
- `feat(contract): implement donation forwarding`
- `test(contract): cover beneficiary transfer logic`
- `feat(frontend): add campaign detail page`
- `docs: add ubuntu demo guide`

Required docs:
- `README.md`
- `docs/IMPLEMENTATION_PLAN.md`
- `docs/TEST_PLAN.md`
- `docs/DEMO_GUIDE.md`
- `docs/ARCHITECTURE.md`
- `docs/PROGRESS_LOG.md`

---

## 40. Codex Implementation Rules

When this PRD is given to Codex:
1. Build incrementally by phase.
2. Do not build frontend before core contract logic is tested.
3. Every phase must include tests.
4. Update docs after each phase.
5. Do not invent business rules beyond this PRD.
6. Prefer correctness and PRD compliance over feature sprawl.
7. Keep UI demo-friendly and readable.
8. Avoid adding unrelated dependencies unless justified.

---

## 41. Definition of Done

The project is done when:
1. Ganache runs locally on Ubuntu.
2. Truffle compiles and deploys the contract successfully.
3. MetaMask connects to the local chain.
4. Campaigns can be created.
5. Verifier/admin can approve or reject campaigns.
6. Donors can donate to approved campaigns.
7. Donations are recorded immutably.
8. ETH reaches the beneficiary wallet directly.
9. Proof updates are visible.
10. Donor dashboard works.
11. Admin pause/resume works.
12. Demo guide reproduces the entire workflow.
13. README and docs are clear enough for a reviewer to follow independently.

---

## 42. Future Work

Good presentation talking points:
- item donation pledge tracking,
- IPFS-backed metadata storage,
- decentralized identity integration,
- multiple verifiers with consensus approval,
- donor subscriptions or recurring donations,
- QR-code campaign sharing,
- analytics-based fraud risk scoring,
- multi-chain deployment.

---

## 43. Final Recommendation

The best balance of correctness, originality, and implementation safety is:
- one main Solidity contract,
- direct beneficiary payout,
- verifier approval flow,
- proof timeline,
- donor receipt,
- React dashboard with clear trust indicators,
- strong test coverage,
- simple Ubuntu setup and demo guide.

That combination fully satisfies the assignment while adding enough distinct value to make the project stand out.

---

# Appendix A — Minimal Implementation Checklist

## Smart contract
- [ ] create campaign
- [ ] validate campaign input
- [ ] verifier role
- [ ] approve / reject campaign
- [ ] pause / resume campaign
- [ ] donate to campaign
- [ ] direct ETH forwarding
- [ ] record donation
- [ ] add campaign update
- [ ] close campaign
- [ ] read functions

## Testing
- [ ] campaign creation tests
- [ ] verifier permission tests
- [ ] donation flow tests
- [ ] beneficiary balance tests
- [ ] update timeline tests
- [ ] pause/resume tests
- [ ] completion tests

## Frontend
- [ ] MetaMask connect
- [ ] network banner
- [ ] campaign creation form
- [ ] campaign list
- [ ] campaign detail page
- [ ] donation form
- [ ] proof timeline
- [ ] donor dashboard
- [ ] verifier panel
- [ ] donation receipt

## Demo
- [ ] create campaign
- [ ] approve campaign
- [ ] donate
- [ ] show beneficiary received ETH
- [ ] add proof update
- [ ] pause/resume
- [ ] donor history
- [ ] complete campaign

---

# Appendix B — Suggested First Build Order

1. Contract storage and role setup
2. Campaign creation
3. Approval/rejection logic
4. Donation recording + ETH forwarding
5. Update timeline
6. Contract tests
7. Frontend wallet connection
8. Campaign list and detail page
9. Donation flow
10. Admin/verifier panel
11. Donor dashboard
12. Demo polishing

---

# Appendix C — Quick Start Commands

```bash
# terminal 1
ganache --wallet.totalAccounts 20 --wallet.defaultBalance 1000 --chain.chainId 1337 --server.host 127.0.0.1 --server.port 8545

# terminal 2
truffle compile
truffle migrate --network development --reset

# terminal 3
cd client
npm install
npm run dev
```
