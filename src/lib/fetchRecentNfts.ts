export const GET_RECENT_NFTS = `
  query GetMarketplaceData {
    allItemListeds(first: 20, orderBy: [BLOCK_NUMBER_DESC, TX_INDEX_DESC]) {
      nodes {
        rindexerId
        seller
        nftAddress
        price
        tokenId
        contractAddress
        txHash
        blockNumber
      }
    }
    allItemCanceleds {
      nodes {
        nftAddress
        tokenId
      }
    }
    allItemBoughts {
      nodes {
        tokenId
        nftAddress
      }
    }
  }
`

export interface NFTQueryResponse {
    data: {
        allItemListeds: {
            nodes: Array<{
                rindexerId: string
                seller: string
                nftAddress: string
                price: string
                tokenId: string
                contractAddress: string
                txHash: string
                blockNumber: string
            }>
        }
        allItemBoughts: {
            nodes: Array<{ nftAddress: string; tokenId: string }>
        }
        allItemCanceleds: {
            nodes: Array<{ nftAddress: string; tokenId: string }>
        }
    }
    errors?: Array<{ message: string }>
}

export async function fetchRecentNfts(
    fetchImpl: typeof fetch = fetch
): Promise<NFTQueryResponse> {
    const response = await fetchImpl("/api/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        body: JSON.stringify({
            query: GET_RECENT_NFTS,
        }),
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonResponse = await response.json()

    if (jsonResponse.errors) {
        throw new Error(
            `GraphQL error: ${jsonResponse.errors.map((e: { message: string }) => e.message).join(", ")}`
        )
    }

    return jsonResponse as NFTQueryResponse
}
