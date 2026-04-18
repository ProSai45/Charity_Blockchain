# Test Plan

## Contract Coverage Checklist

### Phase 1
- [x] contract compiles with Solidity `0.8.20`
- [x] valid campaign creation succeeds
- [x] empty title is rejected
- [x] empty description hash is rejected
- [x] zero beneficiary wallet is rejected
- [x] zero target amount is rejected
- [x] campaign defaults are initialized correctly
- [x] campaign count increments

### Phase 2
- [x] verifier or admin only approval succeeds
- [x] verifier or admin only rejection succeeds
- [x] unauthorized approval is rejected
- [x] unauthorized rejection is rejected
- [x] pause access control works
- [x] resume access control works
- [x] invalid status transitions revert

### Phase 3
- [x] donation to active campaign succeeds
- [x] donation to pending campaign fails
- [x] donation to rejected campaign fails
- [x] donation to paused campaign fails
- [x] donation to completed campaign fails
- [x] zero donation fails
- [x] donation record persists correctly
- [x] raised amount updates correctly
- [x] donation count updates correctly
- [x] beneficiary receives ETH

### Phase 4
- [x] authorized proof update succeeds
- [x] unauthorized proof update fails
- [x] latest proof hash updates
- [x] complete campaign succeeds
- [x] completed campaign blocks donations
- [x] update timeline order is preserved

### Phase 5
- [x] all PRD contract acceptance criteria are covered in the automated suite

## Frontend Manual Verification Checklist

- [ ] MetaMask connection works
- [ ] wrong-network handling is visible
- [ ] campaign creation works from UI
- [ ] campaign list loads live on-chain data
- [ ] campaign detail page shows funding, proof, and donation data
- [ ] campaign approval works from UI
- [ ] donation flow works from UI
- [ ] donation receipt appears after success
- [ ] proof timeline is visible
- [ ] verifier panel shows only allowed actions for the connected role
- [ ] approve and reject actions work from UI
- [ ] pause and resume behavior is visible
- [ ] complete action works from UI
- [ ] completed campaign blocks donations
- [ ] donor dashboard shows expected data

## Final Reviewer Verification Pass

Use the demo sequence in [docs/DEMO_GUIDE.md](/Users/sudharshan/Desktop/PES/SEM%206/Blockchain/New_Project/docs/DEMO_GUIDE.md) and confirm:

1. Wrong-network messaging appears before switching to Ganache.
2. Creator can submit a valid campaign and invalid inputs are blocked in the UI.
3. Verifier can approve the campaign and the verification tier changes visibly.
4. Donor can donate only while the campaign is active.
5. Receipt details match the donation amount, donor, beneficiary, and transaction hash.
6. Beneficiary balance change is visible in Ganache after donation.
7. Proof update appears in the campaign timeline after publication.
8. Pause blocks donation and resume re-enables it.
9. Completion blocks further donation.
10. Donor dashboard metrics match the donations made during the demo.

## Current Frontend Validation Notes

- [x] Phase 6 frontend dependencies install successfully
- [x] Phase 6 production build succeeds
- [x] Phase 6 Vite dev server boots locally
- [x] Phase 7 production build succeeds after campaign UI integration
- [x] Phase 7 campaign list and detail routes compile against the deployed contract ABI
- [x] Phase 7 create-campaign form validates PRD-required fields before wallet submission
- [x] Phase 8 production build succeeds after donation and donor-dashboard integration
- [x] Phase 8 dev server boots locally outside the sandbox port-binding restriction
- [x] Phase 8 donation form validates ETH amount before wallet submission
- [x] Phase 8 donor dashboard compiles against `getDonationsByDonor(address)` and linked campaign reads
- [x] Phase 9 production build succeeds after verifier/admin control integration
- [x] Phase 9 dev server boots locally outside the sandbox port-binding restriction
- [x] Phase 9 verifier panel compiles against lifecycle, update, and verifier-management contract calls
- [ ] Browser-side MetaMask interaction has been manually confirmed
- [ ] Browser-side wrong-network banner has been manually confirmed
- [ ] Browser-side contract overview read has been manually confirmed
- [ ] Browser-side campaign creation transaction has been manually confirmed
- [ ] Browser-side campaign list refresh has been manually confirmed
- [ ] Browser-side campaign detail route has been manually confirmed
- [ ] Browser-side donation submission has been manually confirmed
- [ ] Browser-side donation receipt card has been manually confirmed
- [ ] Browser-side donor dashboard refresh has been manually confirmed
- [ ] Browser-side verifier assignment has been manually confirmed
- [ ] Browser-side campaign approval and rejection have been manually confirmed
- [ ] Browser-side pause, resume, update, and complete actions have been manually confirmed

## Edge Cases

- blank strings for required campaign fields
- invalid beneficiary address
- zero target amount
- zero donation amount
- unauthorized privileged actions
- donation attempts in invalid lifecycle states
- forwarding failure on donation
- repeated lifecycle transitions after terminal states

## Expected Demo Validations

1. Campaign can be created by a creator wallet.
2. Campaign must be approved before donation.
3. Donation history becomes visible after donation.
4. Beneficiary wallet balance increases after donation.
5. Proof timeline updates after an authorized update.
6. Pause blocks donations and resume re-enables them.
7. Completed campaigns reject further donations.
8. Verifier and owner controls are visible only to the appropriate wallets.
