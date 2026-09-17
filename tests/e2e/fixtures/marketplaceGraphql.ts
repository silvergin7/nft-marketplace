/** GraphQL shapes returned by rindexer via /api/graphql (see fetchRecentNfts.ts). */
/** Anvil Cake NFT — matches chainsToContracts[31337].cakeNft in src/constants.ts */
export const cakeNftAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0"
const cakeNft = cakeNftAddress

export const emptyMarketplaceGraphql = {
    data: {
        allItemListeds: { nodes: [] as Record<string, string>[] },
        allItemBoughts: { nodes: [] as Record<string, string>[] },
        allItemCanceleds: { nodes: [] as Record<string, string>[] },
    },
}

export function activeListingNode(tokenId: string, overrides: Partial<Record<string, string>> = {}) {
    return {
        rindexerId: `listed-${tokenId}`,
        seller: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        nftAddress: cakeNft,
        price: "1000000",
        tokenId,
        contractAddress: cakeNft,
        txHash: "0xabc",
        blockNumber: "1",
        ...overrides,
    }
}

export const singleActiveListingGraphql = {
    data: {
        allItemListeds: { nodes: [activeListingNode("1")] },
        allItemBoughts: { nodes: [] as Record<string, string>[] },
        allItemCanceleds: { nodes: [] as Record<string, string>[] },
    },
}

/** Listed token 1 was bought — filterActiveListings should hide it. */
export const boughtListingGraphql = {
    data: {
        allItemListeds: { nodes: [activeListingNode("1"), activeListingNode("2")] },
        allItemBoughts: { nodes: [{ nftAddress: cakeNft, tokenId: "1" }] },
        allItemCanceleds: { nodes: [] as Record<string, string>[] },
    },
}
