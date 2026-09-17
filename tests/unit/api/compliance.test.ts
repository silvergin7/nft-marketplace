import { afterEach, describe, expect, it, vi } from "vitest"
import { POST } from "@/app/api/compliance/route"

function jsonRequest(body: unknown) {
    return new Request("http://localhost/api/compliance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
}

describe("POST /api/compliance", () => {
    const env = process.env

    afterEach(() => {
        process.env = { ...env }
        vi.restoreAllMocks()
    })

    it("returns 400 when address is missing", async () => {
        const res = await POST(jsonRequest({}))
        expect(res.status).toBe(400)
        const body = await res.json()
        expect(body.success).toBe(false)
    })

    it("auto-approves when compliance is disabled", async () => {
        process.env.ENABLE_COMPLIANCE_CHECK = "false"
        const res = await POST(jsonRequest({ address: "0x123" }))
        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.success).toBe(true)
        expect(body.isApproved).toBe(true)
    })

    it("returns 500 when compliance enabled but API key missing", async () => {
        process.env.ENABLE_COMPLIANCE_CHECK = "true"
        delete process.env.CIRCLE_API_KEY
        const res = await POST(jsonRequest({ address: "0x123" }))
        expect(res.status).toBe(500)
    })

    it("returns approval from Circle nested payload", async () => {
        process.env.ENABLE_COMPLIANCE_CHECK = "true"
        process.env.CIRCLE_API_KEY = "test-key"

        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: true,
                json: async () => ({ data: { result: "APPROVED" } }),
            })
        )

        const res = await POST(jsonRequest({ address: "0xabc" }))
        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.isApproved).toBe(true)
    })

    it("propagates Circle HTTP errors", async () => {
        process.env.ENABLE_COMPLIANCE_CHECK = "true"
        process.env.CIRCLE_API_KEY = "test-key"

        vi.stubGlobal(
            "fetch",
            vi.fn().mockResolvedValue({
                ok: false,
                status: 403,
                statusText: "Forbidden",
                json: async () => ({ message: "invalid key" }),
            })
        )

        const res = await POST(jsonRequest({ address: "0xabc" }))
        expect(res.status).toBe(403)
        const body = await res.json()
        expect(body.success).toBe(false)
    })
})
