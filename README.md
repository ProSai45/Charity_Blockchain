# Blockchain-Based Charity Donation Platform

Local prototype for the PRD-defined charity donation platform built with Solidity, Truffle, Ganache, MetaMask, and a React frontend. The implementation is being developed incrementally, with contract logic validated before frontend work begins.

## Current Status

- Phase 0: planning and documentation scaffold
- Phase 1: contract core and campaign creation completed
- Phase 2: role management and verification workflow completed
- Phase 3: donation recording and direct ETH forwarding completed
- Phase 4: proof updates and campaign lifecycle completion completed
- Phase 5: contract test hardening completed
- Phase 6: React frontend skeleton and wallet handling implemented
- Phase 7: campaign listing, creation, and detail UI implemented
- Phase 8: donation flow UI and donor dashboard implemented
- Phase 9: verifier/admin panel and lifecycle controls implemented
- Phase 10: polish, documentation, and demo packaging completed

## Tech Stack

- Solidity `0.8.20`
- Truffle
- Ganache
- MetaMask
- React + Vite + ethers.js
- Ubuntu/Linux-friendly setup and demo flow

## Repository Layout

```text
contracts/
migrations/
test/
client/
docs/
README.md
truffle-config.js
package.json
```

## Prerequisites

- Node.js `20.x`
- npm `10.x` or newer
- Truffle
- Ganache
- MetaMask browser extension

Ubuntu/Linux setup commands are documented in [docs/DEMO_GUIDE.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/DEMO_GUIDE.md) and summarized from the PRD.

## Planned Local Workflow

1. Start Ganache on `127.0.0.1:8545` with chain ID `1337`.
2. Install root dependencies with `npm install`.
3. Compile contracts with `npm run compile`.
4. Run Truffle tests with `npm test`.
5. Deploy with `npm run migrate:reset`.
6. Start the React client from `client/`.

## Quick Commands

```bash
npm install
npm run compile
npm test
npm run migrate:reset
npm run client:install
npm run client:build
npm run client:dev
```

## Validation Snapshot

- `npm install` completed successfully
- `npm run compile` passed with `solc 0.8.20`
- `npm test` passed with `46 passing`
- `npm run migrate:reset` deployed successfully to local Ganache
- `npm run client:build` passed from the root helper script
- `cd client && npm install` completed successfully
- `cd client && npm run build` passed
- `cd client && npm run dev -- --host 127.0.0.1 --port 5173` started successfully

Frontend coverage now includes:
- live campaign listing from on-chain reads
- campaign creation form with PRD-required fields
- campaign detail route with funding state, proof timeline, donation snapshot, and donation entry
- donor dashboard with receipt history and support metrics
- verifier/admin panel with approval, rejection, pause, resume, completion, proof updates, and owner-only verifier management
- loading, empty, and error states for campaign reads

## Quick Start

1. Start Ganache with chain ID `1337`.
2. Run `npm install`.
3. Run `npm run compile`.
4. Run `npm test`.
5. Run `npm run migrate:reset`.
6. Run `npm run client:install`.
7. Run `npm run client:dev`.
8. In MetaMask, add the Ganache network and import the Ganache accounts you want to demo.
9. Open `http://127.0.0.1:5173/`.
10. Use the wallet roles from [docs/DEMO_GUIDE.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/DEMO_GUIDE.md) to run the PRD demo flow.

## Frontend Startup

```bash
npm run client:install
npm run client:dev
```

The frontend auto-resolves the latest Truffle deployment address from `build/contracts/CharityDonationPlatform.json`, with an optional override through `VITE_CONTRACT_ADDRESS`.

Manual browser verification is still required for MetaMask click-through flows and transaction signing because this CLI environment cannot operate the browser extension directly.

## Demo Summary

The intended local demo sequence is:
1. creator wallet creates a campaign
2. verifier wallet approves it with a visible verification tier
3. donor wallet donates and receives a donor-facing receipt
4. beneficiary wallet balance change is shown in Ganache
5. verifier or creator publishes a proof update
6. verifier pauses and resumes the campaign
7. creator, owner, or verifier completes the campaign
8. donor dashboard and trust metrics are shown

## Known Limitations

- Browser-side MetaMask actions were implemented and build-validated, but not click-verified from this CLI environment.
- The prototype is intentionally local-only and uses Ganache rather than public testnets.
- The optional beneficiary-authored update path remains out of scope because the PRD treats it as optional.
- Campaign hashes are expected to be prepared externally; the app stores and displays them but does not generate IPFS or file hashes itself.

## Documentation Index

- [Implementation plan](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/IMPLEMENTATION_PLAN.md)
- [Architecture](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/ARCHITECTURE.md)
- [Progress log](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/PROGRESS_LOG.md)
- [Test plan](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/TEST_PLAN.md)
- [Demo guide](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/DEMO_GUIDE.md)
- [PRD checklist](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/PRD_REQUIREMENTS_CHECKLIST.md)

## PRD Source of Truth

The canonical requirements source is [Blockchain_Charity_Donation_Platform_PRD.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/Blockchain_Charity_Donation_Platform_PRD.md). Where the PRD leaves limited ambiguity, implementation decisions are documented in the progress log and architecture notes.
