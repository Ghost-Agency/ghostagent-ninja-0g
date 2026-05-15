# GhostAgent — Sovereign Agent Identity

**0G APAC Hackathon Submission**

**One-Sentence Description:** 
GhostAgent bridges Web3 smart accounts with AI agents, creating fully sovereign, tradeable, on-chain autonomous identities powered by 0G Storage and SpaceID integration.

---

## 1. Project Summary

### What the project does
GhostAgent.ninja transforms anonymous Gnosis Safe smart accounts into human-readable, autonomous AI agents. By integrating with `nftmail.box` (a decentralized email protocol), users can mint a token-bound email inbox (e.g. `concierge@nftmail.box`) and "Molt" it into an active, intelligent agent. This agent possesses its own LLM brain, can autonomously read and send emails, and execute blockchain transactions, effectively acting as an autonomous digital employee that can be hired or sold on a marketplace.

### The Problem it solves
When an AI agent controls a smart wallet (like a Gnosis Safe), that entity is represented as an anonymous hex string (`0xb7e4...13F4`). If an agent requests money or interacts with another agent, there is zero verifiable trust layer (Agent-to-Agent "A2A"). Furthermore, Web3 infrastructure lacks a secure, scalable way to store an agent's memory, state, and inbox records without resorting to centralized Web2 databases. GhostAgent solves this by providing readable sovereign identities bundled with decentralized memory storage.

### 0G Components Used
1. **0G Storage (Persistence):** We abandoned legacy IPFS gateways in favor of `@0glabs/0g-ts-sdk`. All agent memory, system metadata, and handshake certificates are permanently archived on 0G Storage.
2. **0G Chain (Newton Testnet):** We deployed the `GhostAgentStorageLog` smart contract to 0G Chain to permanently index and verify the storage root hashes of our agent's metadata arrays, proving state independently of centralized indexers.
3. **SpaceID (.0g Domains):** We integrated `@web3-name-sdk/core` to enable users to select native `.0g` network domains as their agent’s core identity layer during the smart account provisioning phase.

---

## 2. 0G Integration Proof

### A. 0G Storage Integration
We utilize the `@0glabs/0g-ts-sdk` via a universal adapter in `app/services/zero-g-storage.ts`. Every time an agent modifies its state or generates an IP transfer agreement, the data is instantly routed and pinned out via the 0G Network.
- *Proof:* See `app/services/zero-g-storage.ts` and `app/api/handshake/route.ts` where memory objects are dispatched to 0G Storage endpoints.

### B. On-Chain Smart Contract Logging
We deployed a verification logger to **0G Newton Testnet** to allow trustless fetching of agent configuration state.
- **Contract Address:** `0x8378054ffFac40f795dbA039156535eb953b3356` (0G Newton Testnet)
- **0G Flow Contract Address:** `0x0460aA47b41a66694c0a73f667a40812ed49e9dD` (Used by our 0G Storage adapter to submit Merkle roots)
- **Explorer Link:** [View Contract on 0G Explorer](https://scan-testnet.0g.ai/address/0x8378054ffFac40f795dbA039156535eb953b3356)

### C. Agent ID (SpaceID)
We incorporated the official Web3 name SDK to parse and bind `.0g` suffix namespace selections when creating Token Bound Accounts, allowing direct interoperability within the 0G ecosystem.

### D. Live Relay Infrastructure
To prove GhostAgent is a production-ready protocol (and not a frontend mockup), the system is powered by a live **Cloudflare Workers** backend:
- `nftmail-email-worker`: Manages ECIES encryption, blinding, and KV state.
- `email-ingest`: Inbound Mailgun routing connecting real-world emails to the agent's inbox.

---

## 3. System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│             GhostAgent.ninja & NFTMail Core                  │
│                                                             │
│  ┌──────────┐  ┌─────────┐   ┌──────────┐  ┌────────────┐   │
│  │ Mint Flow│  │  .0g    │   │Handshake │  │ ERC-8004   │   │
│  │ (SpaceID)│  │ Resolver│   │ Certs    │  │ Registrar  │   │
│  └────┬─────┘  └────┬────┘   └────┬─────┘  └─────┬──────┘   │
│       └─────────────┴─────────────┴───────────────┘         │
│                          │                                  │
│              ┌───────────▼───────────┐                      │
│              │  zero-g-storage.ts    │  ◄── 0G ADAPTER      │
│              │  uploadToZeroG()      │                      │
│              │  zeroGGatewayUrl()    │                      │
│              └───────────┬───────────┘                      │
└──────────────────────────┼──────────────────────────────────┘
                           │
              ┌────────────▼────────────┐
              │      0G Storage         │  ◄── STATE PERSISTENCE
              │  (Decentralized DA)     │
              └────────────┬────────────┘
                           │
              ┌────────────▼────────────┐
              │      0G Chain           │  ◄── CHAIN LOGGING
              │  GhostAgentStorageLog   │
              │  (logs rootHash events) │
              └─────────────────────────┘
```

**How the Modules Support the Product:**
- **0G Storage** provides the high-bandwidth, decentralized backbone necessary for Autonomous Agents to keep extensive memory context without relying on AWS or paying exorbitant EVM gas costs.
- **0G Chain** provides the immutable timestamp ledger for when an agent's logic pathway or memory base was altered, validating A2A trust models.

---

## 4. Local Deployment & Reproduction

### Prerequisites
- Node.js (v18+)
- A crypto wallet (e.g., MetaMask, Rabby) for logging in via Privy.

### Setup Steps
```bash
# 1. Clone the repository
git clone https://github.com/eyemine/ghostagent-ninja.git
cd ghostagent-ninja

# 2. Setup Environment Variables
# Copy the example file:
cp env.example .env.local

# REQUIRED 0G ENV VARS (ensure these are populated):
# ZEROG_PRIVATE_KEY=<your 0G Network funding private key>
# ZEROG_STORAGE_NODE=https://rpc-testnet.0g.ai
# NEXT_PUBLIC_ZEROG_GATEWAY=https://${YOUR_RPC_ENDPOINT}

# 3. Install dependencies
npm install

# 4. Boot the development servers
npm run dev
```
The site will run on `http://localhost:3000`. 
*(Note: To interact with the NFTMail protocol frontend, clone the sister repository `nftmailbox-netlify-0g` and run it on port 3001.)*

### Test Account Details
- Ensure your MetaMask wallet is connected to **0G Newton Testnet**.
- You will need testnet 0G tokens to interact with the Storage logging actions if configuring fresh agents.
- **Faucet Instructions:** Visit the official [0G Newton Faucet](https://faucet.0g.ai/) to request test tokens for your wallet address prior to executing the `Molt` logic.

---

## 5. Demo Video

[Link to YouTube / Loom Demo Video] *(Teams: Paste your 3-minute video link here prior to submitting to HackQuest.)*

---

**Built by the GhostAgent Team for the 0G APAC Hackathon (May 2026).**
