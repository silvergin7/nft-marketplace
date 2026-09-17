"use client"

import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import RecentlyListedNFTs from "@/components/RecentlyListed"

export default function Home() {
    const { isConnected, address } = useAccount()
    const [isCompliant, setIsCompliant] = useState(true)

    async function checkCompliance() {
        if (!address) return

        try {
            const response = await fetch("/api/compliance", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ address }),
            })

            if (!response.ok) {
                console.error("Compliance API request failed:", response.statusText)
                setIsCompliant(false)
                return
            }

            const result = await response.json()
            setIsCompliant(result.success && result.isApproved)
        } catch (error) {
            console.error("Error calling compliance API:", error)
            setIsCompliant(false)
        }
    }

    useEffect(() => {
        if (isConnected && address) {
            checkCompliance()
        } else {
            setIsCompliant(true)
        }
    }, [address, isConnected])

    return (
        <main>
            {!isConnected ? (
                <div className="flex items-center justify-center p-4 md:p-6 xl:p-8">
                    Please connect your wallet to continue.
                </div>
            ) : isCompliant ? (
                <div className="flex flex-col items-center justify-center p-4 md:p-6 xl:p-8">
                    <h1>Welcome to the App!</h1>
                    <RecentlyListedNFTs />
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-4 md:p-6 xl:p-8">
                    <h1>Access Denied</h1>
                    <p>
                        Your connected wallet address is not permitted to use this
                        application based on compliance checks.
                    </p>
                </div>
            )}
        </main>
    )
}
