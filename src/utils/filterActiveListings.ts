export interface ListedNftNode {
    seller: string
    nftAddress: string
    price: string
    tokenId: string
}

export interface BoughtCancelledNode {
    nftAddress: string
    tokenId: string
}

export interface MarketplaceIndexerData {
    allItemListeds: { nodes: ListedNftNode[] }
    allItemBoughts?: { nodes: BoughtCancelledNode[] }
    allItemCanceleds?: { nodes: BoughtCancelledNode[] }
}

export interface ActiveListing {
    tokenId: string
    contractAddress: string
    price: string
    seller: string
}

export function filterActiveListings(
    data: MarketplaceIndexerData | undefined | null,
    limit = 100
): ActiveListing[] {
    if (!data?.allItemListeds?.nodes) {
        return []
    }

    const boughtNFTs = new Set<string>()
    data.allItemBoughts?.nodes.forEach(item => {
        if (item.nftAddress && item.tokenId) {
            boughtNFTs.add(`${item.nftAddress}-${item.tokenId}`)
        }
    })

    const cancelledNFTs = new Set<string>()
    data.allItemCanceleds?.nodes.forEach(item => {
        if (item.nftAddress && item.tokenId) {
            cancelledNFTs.add(`${item.nftAddress}-${item.tokenId}`)
        }
    })

    const activeNfts = data.allItemListeds.nodes.filter(item => {
        if (!item.nftAddress || !item.tokenId) return false
        const key = `${item.nftAddress}-${item.tokenId}`
        return !boughtNFTs.has(key) && !cancelledNFTs.has(key)
    })

    return activeNfts.slice(0, limit).map(nft => ({
        tokenId: nft.tokenId,
        contractAddress: nft.nftAddress,
        price: nft.price,
        seller: nft.seller,
    }))
}
