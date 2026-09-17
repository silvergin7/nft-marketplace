import { spawn } from "node:child_process"
import fs from "node:fs"
import net from "node:net"
import path from "node:path"

const PID_FILE = path.join(__dirname, ".anvil.pid")

function waitForPort(port: number, host = "127.0.0.1", timeoutMs = 60_000): Promise<void> {
    const started = Date.now()

    return new Promise((resolve, reject) => {
        const tryConnect = () => {
            const socket = net.connect({ port, host }, () => {
                socket.end()
                resolve()
            })

            socket.on("error", () => {
                if (Date.now() - started > timeoutMs) {
                    reject(new Error(`Timed out waiting for ${host}:${port}`))
                    return
                }
                setTimeout(tryConnect, 400)
            })
        }

        tryConnect()
    })
}

async function isPortOpen(port: number, host = "127.0.0.1"): Promise<boolean> {
    return new Promise(resolve => {
        const socket = net.connect({ port, host }, () => {
            socket.end()
            resolve(true)
        })
        socket.on("error", () => resolve(false))
    })
}

export default async function globalSetup() {
    if (process.env.SKIP_ANVIL === "1" || (await isPortOpen(8545))) {
        await waitForPort(8545)
        return
    }

    const anvil = spawn(
        "anvil",
        ["--load-state", "marketplace-anvil.json", "--block-time", "2", "--host", "127.0.0.1", "--port", "8545"],
        {
            cwd: process.cwd(),
            stdio: "ignore",
            detached: true,
        }
    )

    if (!anvil.pid) {
        throw new Error("Failed to start Anvil for E2E tests")
    }

    fs.writeFileSync(PID_FILE, String(anvil.pid))
    anvil.unref()

    await waitForPort(8545)
}
