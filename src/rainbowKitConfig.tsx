"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { anvil } from "wagmi/chains"

const walletConnectProjectId =
    process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "00000000000000000000000000000000"

export default getDefaultConfig({
    appName: "NFT Marketplace",
    projectId: walletConnectProjectId,
    chains: [anvil],
    ssr: true,
})
