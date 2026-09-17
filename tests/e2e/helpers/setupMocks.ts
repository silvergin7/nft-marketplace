import type { Page } from "@playwright/test"
import { mockApprovedCompliance } from "./mockCompliance"
import { mockEmptyMarketplaceGraphql } from "./mockGraphql"

export async function setupE2eMocks(page: Page) {
    await mockEmptyMarketplaceGraphql(page)
    await mockApprovedCompliance(page)
}
