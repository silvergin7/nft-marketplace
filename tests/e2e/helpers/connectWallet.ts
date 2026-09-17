import type { Page } from "@playwright/test"
import { expect } from "@playwright/test"

const ANVIL_CHAIN_ID = 31337

type WalletMock = {
    connectToDapp(wallet?: "metamask" | "walletconnect"): Promise<void>
    addNetwork(network: {
        name: string
        rpcUrl: string
        chainId: number
        nativeCurrency?: { name: string; symbol: string; decimals: number }
    }): Promise<void>
}

/** Register Anvil in Depay Web3Mock and switch by name (avoid Synpress switchNetwork → hardcoded 0xa). */
async function ensureAnvilChain(page: Page, ethereumWalletMock: WalletMock) {
    await ethereumWalletMock.addNetwork({
        name: "Anvil",
        rpcUrl: "http://127.0.0.1:8545",
        chainId: ANVIL_CHAIN_ID,
        nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    })

    await page.evaluate(() => {
        Web3Mock.mock({
            blockchain: "ethereum",
            wallet: "metamask",
            network: { switchTo: "Anvil" },
        })
    })
}

function connectedHomeState(page: Page) {
    return page
        .getByRole("heading", { name: "Welcome to the App!" })
        .or(page.getByRole("heading", { name: "Access Denied" }))
}

/**
 * Connects RainbowKit via Synpress injected MetaMask mock.
 * Skips modal clicks when the home page already reflects a connected wallet.
 */
export async function connectMockWallet(page: Page, ethereumWalletMock: WalletMock) {
    await ethereumWalletMock.connectToDapp("metamask")
    await ensureAnvilChain(page, ethereumWalletMock)

    const homeState = connectedHomeState(page)
    const alreadyConnected = await homeState
        .waitFor({ state: "visible", timeout: 45_000 })
        .then(() => true)
        .catch(() => false)

    if (alreadyConnected) {
        return
    }

    const connectButton = page.getByTestId("rk-connect-button")
    await connectButton.click({ timeout: 15_000 })
    await page.getByRole("button", { name: /^MetaMask$/i }).click({ timeout: 20_000 })

    await expect(homeState).toBeVisible({ timeout: 45_000 })
}
