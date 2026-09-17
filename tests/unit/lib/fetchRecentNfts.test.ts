import { describe, expect, it, vi } from "vitest"
import { fetchRecentNfts, GET_RECENT_NFTS } from "@/lib/fetchRecentNfts"

describe("fetchRecentNfts", () => {
    it("includes marketplace GraphQL query", () => {
        expect(GET_RECENT_NFTS).toContain("allItemListeds")
        expect(GET_RECENT_NFTS).toContain("allItemBoughts")
        expect(GET_RECENT_NFTS).toContain("allItemCanceleds")
    })

    it("POSTs to /api/graphql and returns data", async () => {
        const mockResponse = {
            data: {
                allItemListeds: { nodes: [] },
                allItemBoughts: { nodes: [] },
                allItemCanceleds: { nodes: [] },
            },
        }
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        })

        const result = await fetchRecentNfts(fetchMock as unknown as typeof fetch)

        expect(fetchMock).toHaveBeenCalledWith(
            "/api/graphql",
            expect.objectContaining({ method: "POST" })
        )
        expect(result).toEqual(mockResponse)
    })

    it("throws on HTTP error", async () => {
        const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 502 })
        await expect(fetchRecentNfts(fetchMock as unknown as typeof fetch)).rejects.toThrow(
            "HTTP error! status: 502"
        )
    })

    it("throws on GraphQL errors", async () => {
        const fetchMock = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({ errors: [{ message: "bad query" }] }),
        })
        await expect(fetchRecentNfts(fetchMock as unknown as typeof fetch)).rejects.toThrow(
            "GraphQL error: bad query"
        )
    })
})
