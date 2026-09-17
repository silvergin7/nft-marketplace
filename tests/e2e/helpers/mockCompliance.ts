import type { Page } from "@playwright/test"

export type ComplianceMockMode = "approved" | "denied"

export async function mockComplianceRoute(
    page: Page,
    mode: ComplianceMockMode,
    onRequest?: (payload: { address?: string }) => void
) {
    await page.route("**/api/compliance", async route => {
        const payload = route.request().postDataJSON() as { address?: string }
        onRequest?.(payload)

        const isApproved = mode === "approved"
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                isApproved,
                data: {
                    result: isApproved ? "APPROVED" : "DENIED",
                    message: `E2E mock (${mode})`,
                },
            }),
        })
    })
}

/** Keeps E2E stable when the dev server has ENABLE_COMPLIANCE_CHECK=true. */
export async function mockApprovedCompliance(page: Page) {
    await mockComplianceRoute(page, "approved")
}
