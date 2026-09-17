import { describe, expect, it } from "vitest"
import formatPrice, { addDecimalsToPrice } from "@/utils/formatPrice"

describe("formatPrice", () => {
    it("formats USDC with 6 decimals", () => {
        expect(formatPrice("10000000")).toBe("10.0000 USDC")
    })

    it("keeps fractional USDC without trailing zeros", () => {
        expect(formatPrice("10500000")).toBe("10.5 USDC")
    })

    it("uses .0000 for whole numbers without fraction", () => {
        expect(formatPrice("1000000")).toBe("1.0000 USDC")
    })

    it("returns input on invalid bigint", () => {
        expect(formatPrice("not-a-number")).toBe("not-a-number")
    })
})

describe("addDecimalsToPrice", () => {
    it("converts human USDC to smallest units", () => {
        expect(addDecimalsToPrice("10")).toBe("10000000")
    })

    it("floors fractional smallest units", () => {
        expect(addDecimalsToPrice("10.999999")).toBe("10999999")
    })

    it("returns input on invalid number", () => {
        expect(addDecimalsToPrice("abc")).toBe("abc")
    })
})
