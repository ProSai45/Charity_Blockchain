# Demo Guide

This guide is the final zero-to-demo walkthrough for the local prototype. It is written so a reviewer can start from a clean Ubuntu/Linux environment, launch the project locally, configure MetaMask, and demonstrate the PRD-required flow end to end.

## Ubuntu / Linux Setup

```bash
sudo apt update
sudo apt install -y curl git build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
npm install -g truffle
npm install -g ganache
```

Recommended versions:
- Node.js `20.x`
- npm `10.x` or newer
- Truffle `5.11.x`
- Ganache CLI `7.x`

## Ganache Startup

Run Ganache in one terminal:

```bash
ganache --wallet.totalAccounts 20 --wallet.defaultBalance 1000 --chain.chainId 1337 --server.host 127.0.0.1 --server.port 8545
```

Keep this terminal open. Ganache will print:
- RPC URL
- chain ID
- funded accounts
- private keys

## Project Bootstrap

From the project root:

```bash
npm install
npm run compile
npm test
npm run migrate:reset
npm run client:install
```

Expected result:
- contracts compile with Solidity `0.8.20`
- Truffle tests pass
- `CharityDonationPlatform` is redeployed to Ganache

## Frontend Startup

In a second terminal:

```bash
npm run client:dev
```

Open:

```text
http://127.0.0.1:5173/
```

## MetaMask Network Configuration

Add a custom network in MetaMask:
- Network name: `Ganache Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `1337`
- Currency symbol: `ETH`

## MetaMask Account Import

Import these Ganache accounts into MetaMask using the private keys shown by Ganache:
- Account 0: owner/admin
- Account 1: verifier
- Account 2: campaign creator
- Account 3: beneficiary
- Account 4: donor A
- Account 5: donor B

Recommended import order:
1. owner/admin
2. verifier
3. creator
4. beneficiary
5. donor A
6. donor B

## Exact Demo Flow

### 1. Start Ganache

Confirm Ganache is listening on `127.0.0.1:8545` with chain ID `1337`.

### 2. Compile, test, and deploy

Run:

```bash
npm run compile
npm test
npm run migrate:reset
```

### 3. Start the frontend

Run:

```bash
npm run client:dev
```

### 4. Connect the owner/admin wallet

In MetaMask:
1. switch to imported Ganache Account 0
2. connect MetaMask to the app
3. confirm the app shows the correct Ganache network

### 5. Create a campaign using the creator wallet

In MetaMask:
1. switch to imported Ganache Account 2

In the app:
1. open `/campaigns`
2. fill the create campaign form with:
   - title: any non-empty demo title
   - description hash: a demo `bytes32`-style content reference string
   - category: a human-readable category
   - beneficiary wallet: Ganache Account 3 address
   - target amount: a positive ETH value such as `5`
   - optional proof bundle hash: optional `bytes32` value
3. submit through MetaMask
4. refresh the campaign list if needed

Expected result:
- new campaign appears in the list
- status is `Pending Verification`
- verification tier is `Unverified`

### 6. Approve the campaign using the verifier wallet

In MetaMask:
1. switch to imported Ganache Account 1

In the app:
1. open `/verifier`
2. find the pending campaign
3. choose a tier such as `NGO-Verified` or `Admin-Verified`
4. click `Approve campaign`

Expected result:
- campaign status becomes `Active`
- verification tier updates visibly
- verified timestamp becomes populated

### 7. Donate using a donor wallet

In MetaMask:
1. switch to imported Ganache Account 4

In the app:
1. open the campaign detail page
2. enter a donation amount such as `1`
3. submit the donation in MetaMask

Expected result:
- donation succeeds only because the campaign is active
- donation count increases
- raised amount increases
- donor impact receipt appears

### 8. Show that donation history is recorded

In the app:
1. stay on the campaign detail page
2. show the donation history snapshot
3. open `/donor`
4. show the donor receipt and support metrics for Account 4

Expected result:
- campaign donation history shows the new donation
- donor dashboard shows receipt count, total donated, and supported campaign count

### 9. Show that the beneficiary wallet received ETH

In Ganache:
1. inspect Ganache Account 3 balance before and after donation

Expected result:
- beneficiary balance increases by the donated amount
- platform contract does not act as escrow

### 10. Add a proof or status update

In MetaMask:
1. switch to Account 1 or Account 2

In the app:
1. open `/verifier`
2. find the approved campaign
3. choose an update type
4. provide a non-zero `bytes32` proof hash
5. publish the update

Expected result:
- campaign detail page shows the new proof timeline entry
- latest proof hash updates

### 11. Show the proof timeline

In the app:
1. open `/campaigns/:campaignId`
2. scroll to the proof/status timeline

Expected result:
- update type label is visible
- timestamp is visible
- author wallet is visible
- details hash is visible

### 12. Pause the campaign and show donation blocking

In MetaMask:
1. switch to Account 1 or Account 0

In the app:
1. open `/verifier`
2. pause the campaign

Then:
1. switch back to donor Account 4
2. attempt another donation

Expected result:
- campaign status shows `Paused`
- new donation attempt is blocked by contract/frontend flow

### 13. Resume the campaign

In MetaMask:
1. switch back to Account 1 or Account 0

In the app:
1. open `/verifier`
2. click `Resume campaign`

Expected result:
- status returns to `Active`

### 14. Donate again optionally

In MetaMask:
1. switch back to donor Account 4 or Account 5

In the app:
1. submit a second donation

Expected result:
- raised amount and donation count update again
- donor dashboard refresh shows the new receipt

### 15. Complete the campaign

In MetaMask:
1. switch to Account 2, Account 1, or Account 0

In the app:
1. open `/verifier`
2. click `Complete campaign`

Expected result:
- status becomes `Completed`
- closed timestamp becomes visible
- future donations are blocked

### 16. Show donor dashboard and platform metrics

In the app:
1. open `/donor`
2. show total donated, receipts, supported campaigns, and verified supported metrics
3. open `/`
4. show top-level platform overview metrics

Expected result:
- donor-side trust and impact data are visible
- role-aware and lifecycle-aware UI is visible

## Wallet Switching Script

Use this switching sequence during the demo:
1. Account 0 for owner/admin overview
2. Account 2 to create a campaign
3. Account 1 to approve the campaign
4. Account 4 to donate
5. Account 1 or 2 to add a proof update
6. Account 1 to pause and resume
7. Account 4 or 5 for optional second donation
8. Account 2, 1, or 0 to complete
9. Account 4 to show donor dashboard

## What To Point Out During Review

- only approved active campaigns can receive donations
- donations are stored immutably and are donor-queryable
- ETH is forwarded directly to the beneficiary wallet
- verification tier and status are visible on cards and detail pages
- proof timeline remains visible throughout the lifecycle
- paused and completed states visibly block donation
- owner-only verifier management is separate from campaign moderation

## Known Demo Limitations

- This environment cannot click MetaMask directly, so browser-side confirmation remains a manual reviewer step.
- Hashes are entered directly as demo content references; the prototype does not generate IPFS hashes.
- The app is intentionally local-first and targets Ganache rather than a public chain.
