import { test, expect } from "../fixtures/synpressTest"
import { connectMockWallet } from "../helpers/connectWallet"
import { mockApprovedCompliance } from "../helpers/mockCompliance"
import {
    boughtListingGraphql,
    cakeNftAddress,
    emptyMarketplaceGraphql,
    singleActiveListingGraphql,
} from "../fixtures/marketplaceGraphql"
import { mockMarketplaceGraphql } from "../helpers/mockGraphql"

test.describe("Recently listed (GraphQL → filter → UI)", () => {
    test.beforeEach(async ({ page }) => {
        await mockApprovedCompliance(page)
    })

    test("shows empty state when indexer returns no active listings", async ({
        page,
        ethereumWalletMock,
    }) => {
        await mockMarketplaceGraphql(page, emptyMarketplaceGraphql)
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)

        await expect(page.getByRole("heading", { name: "Recently Listed" })).toBeVisible()
        await expect(page.getByText("No active NFT listings found.")).toBeVisible()
    })

    test("renders active listing from mocked GraphQL pipeline", async ({ page, ethereumWalletMock }) => {
        await mockMarketplaceGraphql(page, singleActiveListingGraphql)
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)

        await expect(page.getByText("Token #1")).toBeVisible({ timeout: 45_000 })
        await expect(page.getByRole("link", { name: /Token #1/i })).toHaveAttribute(
            "href",
            `/buy-nft/${cakeNftAddress}/1`
        )
    })

    test("hides bought listings (client-side filter over indexer events)", async ({
        page,
        ethereumWalletMock,
    }) => {
        await mockMarketplaceGraphql(page, boughtListingGraphql)
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)

        await expect(page.getByText("Token #2")).toBeVisible({ timeout: 45_000 })
        await expect(page.getByText("Token #1")).not.toBeVisible()
    })

    test("reflects new indexer data after reload (simulated event pipeline refresh)", async ({
        page,
        ethereumWalletMock,
    }) => {
        await mockMarketplaceGraphql(page, emptyMarketplaceGraphql)
        await page.reload()

        await connectMockWallet(page, ethereumWalletMock)
        await expect(page.getByText("No active NFT listings found.")).toBeVisible()

        await mockMarketplaceGraphql(page, singleActiveListingGraphql)
        await page.reload()
        await connectMockWallet(page, ethereumWalletMock)
        await expect(page.getByText("Token #1")).toBeVisible({ timeout: 45_000 })
    })
})
