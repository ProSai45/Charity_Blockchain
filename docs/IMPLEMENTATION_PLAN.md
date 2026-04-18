# Implementation Plan

## PRD Alignment

This implementation plan is derived directly from [Blockchain_Charity_Donation_Platform_PRD.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/Blockchain_Charity_Donation_Platform_PRD.md). The detailed traceability checklist lives in [docs/PRD_REQUIREMENTS_CHECKLIST.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/PRD_REQUIREMENTS_CHECKLIST.md).

## Phase Sequence

### Phase 0: project setup and planning
Deliverables:
- repository scaffold
- documentation scaffold
- PRD-derived checklist
- architecture overview
- initial README

Exit criteria:
- required folders exist
- required docs exist
- checklist maps requirements, entities, roles, and flows to implementation work

### Phase 1: contract core data model and campaign creation
Deliverables:
- `contracts/CharityDonationPlatform.sol`
- enums, structs, state variables
- campaign creation
- core read functions
- core events and custom errors
- migration files and initial unit tests

Exit criteria:
- Truffle compile succeeds
- valid campaign creation test passes
- invalid input tests pass

### Phase 2: role management and verification workflow
Deliverables:
- verifier management
- approve and reject flow
- pause and resume flow
- status transition guards

Exit criteria:
- privileged access tests pass
- valid and invalid status transition tests pass

### Phase 3: donation recording and direct ETH forwarding
Deliverables:
- donation function
- immutable donation records
- donor history mapping
- direct ETH forwarding with revert on failure
- raised amount and donation count updates

Exit criteria:
- active campaign donation test passes
- inactive status donation tests pass
- beneficiary balance assertion passes

### Phase 4: proof updates and lifecycle controls
Deliverables:
- proof and status update publishing
- latest proof hash updates
- completion flow
- update history read functions

Exit criteria:
- authorized update test passes
- unauthorized update test fails as expected
- completed campaigns reject donations

### Phase 5: contract test hardening
Deliverables:
- comprehensive Truffle test suite
- grouped and presentation-friendly scenarios

Exit criteria:
- all contract acceptance criteria are covered
- full contract suite passes cleanly

### Phase 6: React frontend skeleton and wallet handling
Deliverables:
- Vite + React client scaffold
- routing
- MetaMask connect
- network detection
- contract config integration
- shared status and layout components

Exit criteria:
- client boots locally
- wallet connect works
- wrong-network handling is visible
- UI can read deployed contract state

### Phase 7: campaign listing, creation, and detail pages
Deliverables:
- dashboard
- campaign cards and list
- create campaign form
- campaign detail page

Exit criteria:
- campaign creation works from UI
- campaign list refresh works
- detail page shows correct contract data

### Phase 8: donation flow UI and donor dashboard
Deliverables:
- donation form
- transaction status feedback
- donor impact receipt
- donor dashboard and history
- trust dashboard widgets

Exit criteria:
- donation works from UI
- totals refresh correctly
- donor history and receipt render correctly

### Phase 9: verifier and admin panel with lifecycle controls
Deliverables:
- role-aware admin controls
- approve, reject, pause, resume, complete
- proof update form
- proof timeline display

Exit criteria:
- role restrictions are enforced in UI
- state changes reflect correctly
- blocked donation behavior is visible when paused or completed

### Phase 10: polish, final documentation, and demo packaging
Deliverables:
- final README
- Ubuntu setup
- MetaMask import guide
- end-to-end demo script
- documented assumptions and limitations

Exit criteria:
- reviewer can go from zero setup to full demo using docs only

Status:
- completed

## Dependency Notes

- Frontend implementation does not begin until contract core, verification, donation, and proof flows are test-backed.
- A single main contract remains the default unless the PRD requires otherwise.
- Demo clarity takes priority over architectural abstraction.
