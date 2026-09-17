import fs from "node:fs"
import path from "node:path"
import { testWithSynpress } from "@synthetixio/synpress"
import { MetaMask, metaMaskFixtures } from "@synthetixio/synpress/playwright"
import anvilSetup from "../../../test/wallet-setup/anvil.setup"
import { mockEmptyMarketplaceGraphql } from "../helpers/mockGraphql"
import { mockApprovedCompliance } from "../helpers/mockCompliance"

const cacheDir = path.join(process.cwd(), ".cache-synpress", anvilSetup.hash)
const hasSynpressCache = fs.existsSync(cacheDir)

const test = testWithSynpress(metaMaskFixtures(anvilSetup))
const { expect } = test

/**
 * Optional: real MetaMask extension (requires `pnpm run test:cache` on a supported OS).
 * Run via `pnpm run test:e2e:wallet`.
 */
test.describe("MetaMask extension (optional)", () => {
    test.skip(!hasSynpressCache, "Run pnpm run test:cache to build .cache-synpress first")

    test("connects extension to the dapp", async ({ context, page, metamaskPage, extensionId }) => {
        await mockEmptyMarketplaceGraphql(page)
        await mockApprovedCompliance(page)
        await page.reload()

        const metamask = new MetaMask(context, metamaskPage, anvilSetup.walletPassword, extensionId)

        await page.getByTestId("rk-connect-button").click()
        await page.getByRole("button", { name: /^MetaMask$/i }).click()
        await metamask.connectToDapp()

        await expect(page.getByRole("heading", { name: "Welcome to the App!" })).toBeVisible({
            timeout: 60_000,
        })
    })
})
