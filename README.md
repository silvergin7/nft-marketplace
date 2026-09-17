# NFT Marketplace

En fullstack Web3-marknadsplats där användare kan minta Cake-NFTs, lista dem mot USDC, köpa listningar och se nyligen listade NFTs — med plånboksanslutning och adress-screening via Circles compliance-API.

Byggt som slutprojekt i Cyfrin *Full Stack Web3* (utgångspunkt: deras TypeScript-startkod), utökat med egen indexer-integration, GraphQL-feed och compliance-flöde.

## Länkar

| | |
|---|---|
| **GitHub** | https://github.com/silvergin7/ts-nft-marketplace-cu |
| **Live (Vercel)** | https://ts-nft-marketplace-cu-starting-code.vercel.app |

Den hostade appen kör frontend + compliance-API. **On-chain** (Anvil) och **indexer** (GraphQL) körs lokalt vid demo — se [Kör projektet](#kör-projektet).

## Tech stack

- **Frontend:** Next.js, TypeScript, Tailwind, Wagmi, RainbowKit
- **Kontrakt:** Solidity / Foundry (Anvil, chain `31337`)
- **Indexer:** [rindexer](https://github.com/joshstevens19/rindexer) + Postgres (Docker)
- **Compliance:** Circle Address Screening (server-side route `/api/compliance`)
- **Deploy:** Vercel

## Funktioner

- Koppla plånbok (MetaMask m.fl.)
- Compliance-kontroll vid inloggning — blockerar icke-godkända adresser
- **Recently Listed** — NFTs från indexern (filtrerar bort köpta/avbrutna listningar)
- Minta Cake-NFTs, lista NFT, köp med USDC
- GraphQL-proxy: frontend → `/api/graphql` → rindexer

## Projektstruktur

```
├── src/                    # Next.js-app (sidor, komponenter, API routes)
├── marketplaceIndexer/     # rindexer.yaml, ABIs, docker-compose (Postgres)
├── foundry/                # Solidity-kontrakt och scripts
├── marketplace-anvil.json  # Förifylld kedja för pnpm anvil
└── .env.local              # App-hemligheter (ej i git)
```

`pnpm indexer` och `pnpm reset-indexer` använder mappen `marketplaceIndexer/`.

## Kom igång

### Krav

Node, pnpm, Foundry (**Anvil v1.0.x** rekommenderas för `marketplace-anvil.json`), Docker, rindexer.

### Installera

```bash
git clone https://github.com/silvergin7/ts-nft-marketplace-cu.git
cd ts-nft-marketplace-cu
pnpm install
```

### Miljövariabler

Kopiera `.env.example` → `.env.local` och fyll i:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` — [WalletConnect Cloud](https://cloud.walletconnect.com/)
- `GRAPHQL_API_URL=http://localhost:3001/graphql`
- `ENABLE_COMPLIANCE_CHECK` — `true` / `false`
- `CIRCLE_API_KEY` — [Circle Developer Portal](https://console.circle.com/api-keys) (behövs om compliance är på)

Indexer (Postgres):

```bash
cd marketplaceIndexer
cp .env.example .env
docker compose up -d
cd ..
```

### Plånbok (Anvil)

| Fält | Värde |
|------|--------|
| RPC | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Symbol | ETH |

Testkonton med förifylld state (efter `pnpm anvil`):

- Konto **0:** `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- Konto **9:** `0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6`

### Kör projektet

Tre terminaler:

```bash
pnpm anvil      # lokal kedja med kontrakt + NFTs
pnpm indexer    # rindexer + GraphQL :3001
pnpm run dev    # Next.js :3000
```

`pnpm anvil` laddar `marketplace-anvil.json` — samma adresser varje gång.

### Indexer-databas

```bash
pnpm run reset-indexer
```

## Kontrakt (Anvil)

| | Adress |
|---|--------|
| USDC | `0x5FbDB2315678afecb367f032d93F642f64180aa3` |
| NFT Marketplace | `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512` |
| Cake NFT | `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0` |
| Mood NFT | `0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9` |

## Vercel

Frontend deployas till Vercel. Sätt samma env-variabler i Vercel-projektet som i `.env.local` (utom `GRAPHQL_API_URL` om indexern bara kör lokalt).

För **Recently Listed** mot produktion behöver GraphQL nås publikt (t.ex. tunnel till port `3001`) eller körs hela demon lokalt.

## Licens / attribution

Utgår från öppen kurskod från [Cyfrin](https://github.com/cyfrin/ts-nft-marketplace-cu). Implementation, indexer-setup och deployment är mitt eget arbete i detta repo.
