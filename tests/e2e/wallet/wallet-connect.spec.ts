import { test, expect } from "../fixtures/synpressTest"
import { connectMockWallet } from "../helpers/connectWallet"
import { setupE2eMocks } from "../helpers/setupMocks"

test.describe("Wallet connection (Synpress injected mock)", () => {
    test("RainbowKit connect flow reaches connected home state", async ({ page, ethereumWalletMock }) => {
        await setupE2eMocks(page)
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)

        await expect(page.getByRole("heading", { name: "Welcome to the App!" })).toBeVisible({
            timeout: 45_000,
        })
    })
})
