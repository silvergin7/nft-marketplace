import fs from "node:fs"
import path from "node:path"

const PID_FILE = path.join(__dirname, ".anvil.pid")

export default async function globalTeardown() {
    if (process.env.SKIP_ANVIL === "1" || !fs.existsSync(PID_FILE)) {
        return
    }

    const pid = Number(fs.readFileSync(PID_FILE, "utf8"))
    try {
        process.kill(pid, "SIGTERM")
    } catch {
        // Process may already be stopped
    }

    fs.unlinkSync(PID_FILE)
}
