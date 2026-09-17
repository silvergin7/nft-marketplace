import { describe, expect, it } from "vitest"
import { parseCircleIsApproved } from "@/utils/circleCompliance"

describe("parseCircleIsApproved", () => {
    it("approves nested Circle response", () => {
        expect(parseCircleIsApproved({ data: { result: "APPROVED" } })).toBe(true)
    })

    it("approves flat Circle response", () => {
        expect(parseCircleIsApproved({ result: "APPROVED" })).toBe(true)
    })

    it("rejects non-approved results", () => {
        expect(parseCircleIsApproved({ data: { result: "DENIED" } })).toBe(false)
        expect(parseCircleIsApproved({})).toBe(false)
    })
})
