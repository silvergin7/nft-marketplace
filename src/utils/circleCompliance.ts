/** Circle API payloads vary; support nested and flat result shapes. */
export function parseCircleIsApproved(responseData: {
    data?: { result?: string }
    result?: string
}): boolean {
    return (
        responseData?.data?.result === "APPROVED" || responseData?.result === "APPROVED"
    )
}
