import { testWithSynpress } from "@synthetixio/synpress"
import { ethereumWalletMockFixtures } from "@synthetixio/synpress/playwright"

export const test = testWithSynpress(ethereumWalletMockFixtures)
export const { expect } = test
