# Architecture

## High-Level Overview

The platform uses a simple local dApp architecture:

1. Ganache provides local Ethereum accounts and the RPC endpoint.
2. Truffle compiles, tests, and deploys the Solidity contract.
3. A single main contract, `CharityDonationPlatform`, stores campaign, donation, and update history.
4. MetaMask connects browser wallets to the local Ganache chain.
5. A React frontend reads from and writes to the contract through `ethers.js`.

## Contract and Frontend Interaction Model

- Campaign creators submit campaigns on-chain.
- Admin or verifier accounts review and change campaign lifecycle state.
- Donors browse campaigns and donate through MetaMask.
- The contract records donation metadata, updates totals, and forwards ETH directly to the beneficiary wallet in the same transaction.
- The frontend refetches contract state after every write so the audit trail remains visible.

Phase 6 frontend note:
- the React client uses `ethers.js` with `BrowserProvider` for MetaMask-backed reads and writes
- the client resolves the contract ABI from the Truffle build artifact and defaults to the latest deployed address unless `VITE_CONTRACT_ADDRESS` is set
- route scaffolding exists for overview, campaigns, donor, and verifier flows before full data-entry UI is added

Phase 7 frontend note:
- the campaigns route reads `getCampaignCount()` and `getCampaign(id)` to build the discovery view directly from contract state
- the campaign detail route reads `getCampaign`, `getCampaignDonations`, and `getCampaignUpdates` for the proof-of-impact and donation-history view
- campaign creation submits the PRD-required inputs through MetaMask and then refetches the campaign list for demo clarity

Phase 8 frontend note:
- the campaign detail route now submits `donateToCampaign(uint256)` through MetaMask and refreshes contract reads after confirmation
- the donor dashboard reads `getDonationsByDonor(address)` and joins those receipts back to campaign metadata for donor-facing tracking
- receipt presentation is intentionally reconstructed from immutable on-chain fields so the donor view stays explainable without adding a backend

Phase 9 frontend note:
- the verifier panel reads campaign state plus wallet role context to expose only relevant privileged actions
- owner-only verifier management is surfaced separately from campaign lifecycle moderation to keep delegated access changes explicit during demos
- lifecycle writes refetch both campaign data and overview role context so verification and status changes remain immediately visible

Phase 10 packaging note:
- the final documentation assumes frontend contract address auto-resolution from the Truffle artifact, with optional `VITE_CONTRACT_ADDRESS` override only when a reviewer wants to pin a deployment manually
- local demo packaging favors explicit wallet-role switching and visible status badges over hidden automation so the reviewer can inspect each trust transition

## Core Data Model Summary

### Campaign
- creator
- beneficiary wallet
- title
- description hash
- category
- target amount
- raised amount
- donation count
- status
- verification tier
- timestamps
- latest proof hash

### Donation
- campaign ID
- donor
- beneficiary wallet
- amount
- timestamp

### Campaign Update
- campaign ID
- author
- update type
- details hash
- timestamp

## Role Model Summary

- Owner/admin: contract owner with verifier management and lifecycle controls
- Verifier: delegated reviewer allowed to approve, reject, pause, resume, and add proof updates
- Campaign creator: creates campaigns and can add proof updates and complete their campaign
- Donor: views campaigns and donates to approved active campaigns
- Beneficiary: receives ETH directly; optional direct authoring is deferred unless the PRD later requires it

## Campaign Lifecycle Summary

`PENDING_VERIFICATION -> ACTIVE -> PAUSED -> ACTIVE -> COMPLETED`

Alternative terminal path:

`PENDING_VERIFICATION -> REJECTED`

Lifecycle events form the immutable status trail required by the PRD.

Phase 2 implementation note:
- approval and rejection are allowed from `PENDING_VERIFICATION`
- paused campaigns may be re-approved or formally rejected after review
- only owner or delegated verifier accounts can execute verification and pause or resume actions

Phase 4 implementation note:
- creator, owner, and delegated verifier accounts can publish proof or status updates
- `latestProofHash` tracks the newest update hash for trust-dashboard and detail-page use
- completion finalizes the campaign and blocks further donations

Phase 7 presentation note:
- the frontend surfaces lifecycle state and verification tier together so the trust posture of each campaign is visible before donation actions are added in later phases

Phase 9 presentation note:
- the frontend groups moderation and proof actions per campaign so approval, pause, resume, proof publication, and completion can be demonstrated without navigating away from the control context

## Verification Tier Summary

- `UNVERIFIED`
- `SELF_DECLARED`
- `NGO_VERIFIED`
- `ADMIN_VERIFIED`

## ETH Flow Summary

1. Donor submits `donateToCampaign` with ETH.
2. Contract validates campaign status and amount.
3. Contract records the donation in campaign and donor history.
4. Contract updates raised amount and donation count.
5. Contract forwards ETH directly to the beneficiary wallet using `call`.
6. Transaction reverts if forwarding fails.

Phase 8 UI note:
- the donation form surfaces this direct-forwarding model explicitly so the donor sees that funds do not remain escrowed in the platform contract

## Donation Storage Summary

- `donationsByCampaign[campaignId]` keeps the immutable donation timeline per campaign
- `donationsById[donationId]` stores indexed donation records
- `donationIdsByDonor[wallet]` links donor wallets to the donations they made across campaigns

## PRD-Aligned Design Decisions

- The optional `proofBundleHash` from campaign creation will initialize `latestProofHash` when supplied. This matches the PRD requirement to store proof references while keeping the contract to one main campaign struct.
- MVP will use one owner-admin plus optional verifier addresses, matching the PRD statement that a single admin/verifier model is acceptable.
- Beneficiary-authored updates remain out of scope for MVP because the PRD treats them as optional rather than mandatory.

## Known Limitations

- Browser-side MetaMask actions remain a manual verification step because the CLI environment cannot operate the extension.
- The prototype stores user-supplied hashes but does not generate or pin external content.
- The local deployment target is Ganache only; public testnet deployment is intentionally out of scope for this PRD-aligned prototype.
