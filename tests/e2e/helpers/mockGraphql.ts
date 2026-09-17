import type { Page } from "@playwright/test"

type GraphqlBody = { data: Record<string, unknown> }

export async function mockMarketplaceGraphql(page: Page, body: GraphqlBody) {
    await page.route("**/api/graphql", async route => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(body),
        })
    })
}

/** Returns different GraphQL payloads on successive POST /api/graphql calls. */
export async function mockMarketplaceGraphqlSequence(page: Page, bodies: GraphqlBody[]) {
    let callIndex = 0

    await page.route("**/api/graphql", async route => {
        const body = bodies[Math.min(callIndex, bodies.length - 1)]
        callIndex += 1
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify(body),
        })
    })
}

export async function mockEmptyMarketplaceGraphql(page: Page) {
    const { emptyMarketplaceGraphql } = await import("../fixtures/marketplaceGraphql")
    await mockMarketplaceGraphql(page, emptyMarketplaceGraphql)
}
