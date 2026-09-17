# NFT Marketplace

A full-stack Web3 marketplace where users can mint Cake NFTs, list them for USDC, buy listings, and browse recently listed NFTs — with wallet connection and address screening via Circle’s compliance API.

Built as the capstone for Cyfrin’s *Full Stack Web3* course (starting from their TypeScript starter), extended with custom indexer integration, a GraphQL feed, and a compliance flow.

## Links

| | |
|---|---|
| **GitHub** | https://github.com/silvergin7/ts-nft-marketplace-cu |
| **Live (Vercel)** | https://ts-nft-marketplace-cu-starting-code.vercel.app |

The hosted app runs the frontend and compliance API. **On-chain** (Anvil) and the **indexer** (GraphQL) run locally for demos — see [Run the project](#run-the-project).

## Tech stack

- **Frontend:** Next.js, TypeScript, Tailwind, Wagmi, RainbowKit
- **Contracts:** Solidity / Foundry (Anvil, chain `31337`)
- **Indexer:** [rindexer](https://github.com/joshstevens19/rindexer) + Postgres (Docker)
- **Compliance:** Circle Address Screening (server route `/api/compliance`)
- **Deploy:** Vercel

## Features

- Connect a wallet (MetaMask, etc.)
- Compliance check on connect — blocks non-approved addresses
- **Recently Listed** — NFTs from the indexer (filters out bought/cancelled listings)
- Mint Cake NFTs, list NFTs, buy with USDC
- GraphQL proxy: frontend → `/api/graphql` → rindexer

## Project structure

```
├── src/                    # Next.js app (pages, components, API routes)
├── marketplaceIndexer/     # rindexer.yaml, ABIs, docker-compose (Postgres)
├── foundry/                # Solidity contracts and scripts
├── marketplace-anvil.json  # Preloaded chain state for pnpm anvil
└── .env.local              # App secrets (not in git)
```

`pnpm indexer` and `pnpm reset-indexer` use the `marketplaceIndexer/` folder.

## Getting started

### Requirements

Node, pnpm, Foundry (**Anvil v1.0.x** recommended for `marketplace-anvil.json`), Docker, rindexer.

### Install

```bash
git clone https://github.com/silvergin7/ts-nft-marketplace-cu.git
cd ts-nft-marketplace-cu
pnpm install
```

### Environment variables

Copy `.env.example` → `.env.local` and fill in:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `GRAPHQL_API_URL=http://localhost:3001/graphql`
- `ENABLE_COMPLIANCE_CHECK` — `true` / `false`
- `CIRCLE_API_KEY` — [Circle Developer Portal](https://console.circle.com/api-keys) (required if compliance is enabled)

Indexer (Postgres):

```bash
cd marketplaceIndexer
cp .env.example .env
docker compose up -d
cd ..
```

### Wallet (Anvil)

| Field | Value |
|-------|--------|
| RPC | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Symbol | ETH |

Test accounts with preloaded state (after `pnpm anvil`):

- Account **0:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Account **9:** `0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6`

### Run the project

Three terminals:

```bash
pnpm anvil      # local chain with contracts + NFTs
pnpm indexer    # rindexer + GraphQL on :3001
pnpm run dev    # Next.js on :3000
```

`pnpm anvil` loads `marketplace-anvil.json` — same contract addresses every time.

### Reset indexer database

```bash
pnpm run reset-indexer
```

## Contracts (Anvil)

| | Address |
|---|--------|
| USDC | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| NFT Marketplace | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| Cake NFT | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| Mood NFT | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

## Vercel

The frontend is deployed on Vercel. Set the same env vars in the Vercel project as in `.env.local` (except `GRAPHQL_API_URL` if the indexer only runs locally).

For **Recently Listed** in production, GraphQL must be reachable publicly (e.g. a tunnel to port `3001`), or run the full demo locally.

## Tests

Unit tests use [Vitest](https://vitest.dev/):

```bash
pnpm run test:unit        # single run (CI)
pnpm run test:unit:watch  # watch mode
```

Tests live under `tests/unit/` (utils, GraphQL client, compliance API, contract constants).

## License / attribution

Based on open course code from [Cyfrin](https://github.com/cyfrin/ts-nft-marketplace-cu). Implementation, indexer setup, and deployment in this repo are my own work.
