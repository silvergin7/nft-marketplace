import { test, expect } from "@playwright/test"
import { setupE2eMocks } from "../helpers/setupMocks"

test.describe("App load", () => {
    test("home page shows marketplace shell and connect prompt", async ({ page }) => {
        await setupE2eMocks(page)
        await page.goto("/")

        await expect(page.getByRole("heading", { name: "NFT Marketplace", exact: true })).toBeVisible()
        await expect(page.getByText("Please connect your wallet to continue.")).toBeVisible()
        await expect(page.getByTestId("rk-connect-button")).toBeVisible()
    })

    test("list-nft page loads without wallet", async ({ page }) => {
        await page.goto("/list-nft")
        await expect(page.getByRole("heading", { name: "List Your NFT for Sale" })).toBeVisible()
        await expect(page.getByText("Connect your wallet to list your NFT")).toBeVisible()
    })
})
