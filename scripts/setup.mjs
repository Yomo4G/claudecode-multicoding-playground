// scripts/setup.mjs
// Node.js >= 24.13.0 is REQUIRED for setup (security-critical)

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { execSync } from "node:child_process";

/* =======================
   Node.js version guard
======================= */
const REQUIRED_NODE_VERSION = "24.13.0";

function parseVersion(v) {
  return v.split(".").map(Number);
}

function isGte(a, b) {
  const A = parseVersion(a);
  const B = parseVersion(b);
  for (let i = 0; i < B.length; i++) {
    if ((A[i] ?? 0) > B[i]) return true;
    if ((A[i] ?? 0) < B[i]) return false;
  }
  return true;
}

if (!isGte(process.versions.node, REQUIRED_NODE_VERSION)) {
  console.error(
    `\n❌ Node.js ${REQUIRED_NODE_VERSION}+ is required for setup.\n` +
      `Current: ${process.versions.node}\n`,
  );
  process.exit(1);
}

/* =======================
   Paths / args
======================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT_DIR, "project.config.json");
const CLAUDE_DIR = path.join(ROOT_DIR, ".claude");

const FORCE = process.argv.includes("--force");

/* =======================
   Allowed values
======================= */
const ALLOWED = {
  runtime: ["node", "deno", "bun"],
  framework: ["react", "vue", "next", "nuxt", "astro", "gatsby"],
  lint: ["biome", "eslint", "prettier"],
  test: ["playwright", "vitest", "jest", "cypress"],
};

const GOVERNANCE_DIRS = [
  { name: "contexts", desc: "Project purpose / assumptions" },
  { name: "rules", desc: "Hard constraints and prohibitions" },
  { name: "skills", desc: "Explicitly allowed actions for Claude" },
  { name: "output-styles", desc: "Standardized output formats" },
  { name: "workflows", desc: "Approved step-by-step procedures" },
  { name: "quality-gates", desc: "Checklists and verifiable conditions" },
  { name: "hooks", desc: "Deterministic enforcement points" },
  { name: "agents", desc: "Optional AI role definitions" },
  { name: "mcp", desc: "Approved external integrations" },
];

const DEFAULT_CONFIG = {
  runtime: null,
  framework: null,
  lint: null,
  test: null,
};

/* =======================
   Utils
======================= */
function isObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

async function readConfig() {
  try {
    return JSON.parse(await fs.readFile(CONFIG_PATH, "utf8"));
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

async function writeConfig(cfg) {
  await fs.writeFile(CONFIG_PATH, JSON.stringify(cfg, null, 2) + "\n");
}

function validate(cfg) {
  if (!isObject(cfg)) throw new Error("Config must be an object");
  for (const key of Object.keys(DEFAULT_CONFIG)) {
    if (!(key in cfg)) throw new Error(`Missing key: ${key}`);
    const v = cfg[key];
    if (v !== null && !ALLOWED[key].includes(v)) {
      throw new Error(`Invalid value for ${key}: ${v}`);
    }
  }
}

/* =======================
   CLI helpers
======================= */
async function choose(rl, label, options, current) {
  if (current !== null && !FORCE) {
    console.log(`${label}: ${current} (use --force to change)`);
    return current;
  }
  console.log(`Select ${label}:`);
  options.forEach((o, i) => console.log(`  ${i + 1}) ${o}`));
  while (true) {
    const a = Number((await rl.question("> ")).trim());
    if (a >= 1 && a <= options.length) return options[a - 1];
    console.log("Invalid input");
  }
}

async function yesNo(rl, question) {
  while (true) {
    const a = (await rl.question(`${question} (y/n): `)).trim().toLowerCase();
    if (a === "y") return true;
    if (a === "n") return false;
    console.log("Please answer with y or n.");
  }
}

/* =======================
   Runtime-specific checks
======================= */
function ensureRuntimeAvailable(runtime) {
  try {
    if (runtime === "node") execSync("pnpm --version", { stdio: "ignore" });
    if (runtime === "bun") execSync("bun --version", { stdio: "ignore" });
    if (runtime === "deno") execSync("deno --version", { stdio: "ignore" });
  } catch {
    console.error(`\n❌ Required runtime tool not found for: ${runtime}\n`);
    process.exit(1);
  }
}

/* =======================
   Main
======================= */
async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log("=== Project Setup ===\n");

    /* ---- Configuration selection ---- */
    const existing = (await readConfig()) ?? { ...DEFAULT_CONFIG };
    const cfg = { ...DEFAULT_CONFIG, ...existing };
    validate(cfg);

    cfg.runtime = await choose(rl, "runtime", ALLOWED.runtime, cfg.runtime);
    ensureRuntimeAvailable(cfg.runtime);

    cfg.framework = await choose(
      rl,
      "framework",
      ALLOWED.framework,
      cfg.framework,
    );
    cfg.lint = await choose(rl, "lint", ALLOWED.lint, cfg.lint);
    cfg.test = await choose(rl, "test", ALLOWED.test, cfg.test);

    await writeConfig(cfg);

    console.log("\n✅ project.config.json updated:");
    console.log(JSON.stringify(cfg, null, 2));

    /* ---- Claude governance directories ---- */
    console.log("\n=== Claude Governance Setup ===");
    console.log(
      "Select which governance layers to enable.\n" +
        "Directories will be created under .claude/.\n" +
        "You can add more later by creating directories manually.\n",
    );

    for (const g of GOVERNANCE_DIRS) {
      const enable = await yesNo(rl, `Enable ${g.name}? (${g.desc})`);

      if (enable) {
        const dirPath = path.join(CLAUDE_DIR, g.name);
        await fs.mkdir(dirPath, { recursive: true });
        console.log(`  ✓ Created .claude/${g.name}/`);
      }
    }

    /* ---- Next steps ---- */
    console.log(`
✅ Setup completed.

Next steps:
- Review .claude/kickoff.md
- Run /kickoff to initialize governance documents
  (only for directories that were enabled)

No product code will be generated until kickoff is completed.
`);
  } finally {
    rl.close();
  }
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
