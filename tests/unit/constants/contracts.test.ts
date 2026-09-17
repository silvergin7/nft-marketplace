import { describe, expect, it } from "vitest"
import { chainsToContracts } from "@/constants"

describe("chainsToContracts", () => {
    const anvil = chainsToContracts[31337]

    it("defines Anvil marketplace addresses", () => {
        expect(anvil).toBeDefined()
        expect(anvil.usdc).toMatch(/^0x[a-fA-F0-9]{40}$/)
        expect(anvil.nftMarketplace).toMatch(/^0x[a-fA-F0-9]{40}$/)
        expect(anvil.cakeNft).toMatch(/^0x[a-fA-F0-9]{40}$/)
        expect(anvil.moodNft).toMatch(/^0x[a-fA-F0-9]{40}$/)
    })

    it("matches README test addresses", () => {
        expect(anvil.usdc.toLowerCase()).toBe("0x5fbdb2315678afecb367f032d93f642f64180aa3")
        expect(anvil.nftMarketplace.toLowerCase()).toBe(
            "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512"
        )
        expect(anvil.cakeNft.toLowerCase()).toBe("0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0")
    })
})
