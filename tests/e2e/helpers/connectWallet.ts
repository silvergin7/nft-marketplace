import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

type WalletMock = {
    connectToDapp(wallet?: "metamask" | "walletconnect"): Promise<void>
}

/**
 * Connects RainbowKit via Synpress injected MetaMask mock.
 * We avoid custom chain switching: home + compliance only need isConnected;
 * wrong-network UI is covered separately on chain-gated pages.
 */
export async function connectMockWallet(page: Page, ethereumWalletMock: WalletMock) {
    await ethereumWalletMock.connectToDapp("metamask")

    const connectButton = page.getByTestId("rk-connect-button")
    await connectButton.click()

    await page.getByRole("button", { name: /^MetaMask$/i }).click({ timeout: 20_000 })

    await expect(connectButton).not.toContainText(/connect wallet/i, { timeout: 45_000 })
}
