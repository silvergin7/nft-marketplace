import { test, expect } from "@playwright/test"

/**
 * Exercises the real Next.js route handler (no browser mocks).
 * webServer sets ENABLE_COMPLIANCE_CHECK=false so Circle is never called.
 */
test.describe("POST /api/compliance (server)", () => {
    test("returns approved when compliance flag is disabled", async ({ request }) => {
        const address = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        const response = await request.post("/api/compliance", {
            data: { address },
        })

        expect(response.ok()).toBeTruthy()
        const body = await response.json()
        expect(body.success).toBe(true)
        expect(body.isApproved).toBe(true)
    })

    test("returns 400 when address is missing", async ({ request }) => {
        const response = await request.post("/api/compliance", { data: {} })
        expect(response.status()).toBe(400)
    })
})
