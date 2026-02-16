// scripts/teardown.mjs
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

async function main() {
  console.log("=== Teardown ===\n");

  // 1. Stop dev processes (port-based, best-effort)
  console.log("Stopping dev processes...");
  try {
    if (process.platform === "win32") {
      for (const port of [3000, 3001, 5173, 5174]) {
        try {
          const out = execSync(
            `netstat -ano | findstr :${port} | findstr LISTENING`,
            { encoding: "utf8" },
          );
          const pids = [...new Set(
            out.trim().split("\n")
              .map((line) => line.trim().split(/\s+/).pop())
              .filter(Boolean),
          )];
          for (const pid of pids) {
            execSync(`taskkill /PID ${pid} /F`, { stdio: "ignore" });
          }
        } catch { /* port not in use */ }
      }
    } else {
      execSync("lsof -ti:3000,3001,5173,5174 | xargs kill -9 2>/dev/null || true", {
        stdio: "ignore",
      });
    }
    console.log("  ✓ Dev processes stopped");
  } catch {
    console.log("  ⚠ No dev processes found");
  }

  // 2. Delete SQLite databases
  const dbDir = path.join(ROOT_DIR, "db");
  try {
    for (const f of await fs.readdir(dbDir)) {
      if (f.match(/\.sqlite/)) {
        await fs.unlink(path.join(dbDir, f));
        console.log(`  ✓ Deleted db/${f}`);
      }
    }
  } catch { /* no db dir */ }

  // 3. Clean workspace node_modules (monorepo)
  try {
    const cfg = JSON.parse(
      await fs.readFile(path.join(ROOT_DIR, "project.config.json"), "utf8"),
    );
    if (cfg.projectStructure === "monorepo") {
      for (const dir of ["frontend", "backend"]) {
        await fs.rm(path.join(ROOT_DIR, dir, "node_modules"), {
          recursive: true,
          force: true,
        });
        console.log(`  ✓ Cleaned ${dir}/node_modules`);
      }
    }
  } catch { /* config not found */ }

  console.log("\n✅ Teardown complete.");
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
