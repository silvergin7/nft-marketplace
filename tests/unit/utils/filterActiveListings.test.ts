import { describe, expect, it } from "vitest"
import { filterActiveListings } from "@/utils/filterActiveListings"

const nft = (tokenId: string, nftAddress = "0xabc") => ({
    seller: "0xseller",
    nftAddress,
    price: "10000000",
    tokenId,
})

describe("filterActiveListings", () => {
    it("returns empty array when data is missing", () => {
        expect(filterActiveListings(undefined)).toEqual([])
        expect(filterActiveListings(null)).toEqual([])
    })

    it("maps nftAddress to contractAddress", () => {
        const result = filterActiveListings({
            allItemListeds: { nodes: [nft("1", "0xcake")] },
        })
        expect(result).toEqual([
            {
                tokenId: "1",
                contractAddress: "0xcake",
                price: "10000000",
                seller: "0xseller",
            },
        ])
    })

    it("excludes bought listings", () => {
        const result = filterActiveListings({
            allItemListeds: { nodes: [nft("1"), nft("2")] },
            allItemBoughts: { nodes: [{ nftAddress: "0xabc", tokenId: "1" }] },
        })
        expect(result.map(n => n.tokenId)).toEqual(["2"])
    })

    it("excludes cancelled listings", () => {
        const result = filterActiveListings({
            allItemListeds: { nodes: [nft("1"), nft("2")] },
            allItemCanceleds: { nodes: [{ nftAddress: "0xabc", tokenId: "2" }] },
        })
        expect(result.map(n => n.tokenId)).toEqual(["1"])
    })

    it("skips nodes missing address or tokenId", () => {
        const result = filterActiveListings({
            allItemListeds: {
                nodes: [
                    { seller: "0x1", nftAddress: "", price: "1", tokenId: "1" },
                    { seller: "0x1", nftAddress: "0xabc", price: "1", tokenId: "" },
                    nft("3"),
                ],
            },
        })
        expect(result).toHaveLength(1)
        expect(result[0].tokenId).toBe("3")
    })

    it("respects limit", () => {
        const nodes = Array.from({ length: 5 }, (_, i) => nft(String(i)))
        const result = filterActiveListings(
            { allItemListeds: { nodes } },
            2
        )
        expect(result).toHaveLength(2)
    })
})
