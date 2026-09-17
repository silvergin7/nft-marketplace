import { test, expect } from "../fixtures/synpressTest"
import { connectMockWallet } from "../helpers/connectWallet"
import { mockComplianceRoute } from "../helpers/mockCompliance"
import { mockEmptyMarketplaceGraphql } from "../helpers/mockGraphql"

test.describe("Compliance UI (home page after connect)", () => {
    test("calls /api/compliance with connected address and allows approved users", async ({
        page,
        ethereumWalletMock,
    }) => {
        let postedAddress: string | undefined
        await mockEmptyMarketplaceGraphql(page)
        await mockComplianceRoute(page, "approved", payload => {
            postedAddress = payload.address
        })
        await page.reload()

        const complianceRequest = page.waitForRequest(
            req => req.url().includes("/api/compliance") && req.method() === "POST"
        )

        await connectMockWallet(page, ethereumWalletMock)
        await complianceRequest

        expect(postedAddress).toMatch(/^0x[a-fA-F0-9]{40}$/)
        await expect(page.getByRole("heading", { name: "Welcome to the App!" })).toBeVisible()
    })

    test("blocks non-approved wallets with Access Denied", async ({ page, ethereumWalletMock }) => {
        await mockEmptyMarketplaceGraphql(page)
        await mockComplianceRoute(page, "denied")
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)

        await expect(page.getByRole("heading", { name: "Access Denied" })).toBeVisible({
            timeout: 45_000,
        })
        await expect(
            page.getByText(/not permitted to use this application based on compliance checks/i)
        ).toBeVisible()
    })
})
