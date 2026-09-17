import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
    testDir: "./tests/e2e",
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    timeout: 120_000,
    globalSetup: "./tests/e2e/global-setup.ts",
    globalTeardown: "./tests/e2e/global-teardown.ts",
    reporter: [["list"], ["html", { open: "never" }]],
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
        trace: "on-first-retry",
        screenshot: "only-on-failure",
    },
    projects: [
        {
            name: "smoke",
            testMatch: /smoke\/.*\.spec\.ts/,
            use: { ...devices["Desktop Chrome"] },
        },
        {
            name: "wallet",
            testMatch: /wallet\/.*\.spec\.ts/,
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "pnpm run dev",
        url: "http://localhost:3000",
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        env: {
            ENABLE_COMPLIANCE_CHECK: "false",
            NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
                process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
                "00000000000000000000000000000000",
            GRAPHQL_API_URL: "http://127.0.0.1:3001/graphql",
        },
    },
})
