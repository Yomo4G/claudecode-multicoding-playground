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
  projectStructure: ["single", "monorepo"],
  backend: ["api-routes", "separate"],
  backendFramework: ["hono"],
  database: ["sqlite"],
  designMethod: ["conversation", "image", "reference", "auto"],
  designReference: ["x", "youtube", "github", "spotify", "notion", "discord", "slack", "chatgpt"],
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
  projectStructure: null,
  backend: null,
  backendFramework: null,
  database: null,
  devPorts: null,
  designMethod: null,
  designReference: null,
  breakpoints: null,
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
    if (v === null) continue;
    if (key === "breakpoints" || key === "devPorts") {
      if (!isObject(v)) throw new Error(`${key} must be an object`);
      continue;
    }
    if (!ALLOWED[key].includes(v)) {
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

    /* ---- Clean previous scaffolding on --force ---- */
    if (FORCE) {
      console.log("Cleaning previous scaffolding...\n");
      for (const p of ["pnpm-workspace.yaml", "frontend", "backend", "db"]) {
        const full = path.join(ROOT_DIR, p);
        try {
          const st = await fs.stat(full);
          await (st.isDirectory() ? fs.rm(full, { recursive: true, force: true }) : fs.unlink(full));
          console.log(`  ✓ Removed ${p}`);
        } catch (e) { if (e.code !== "ENOENT") throw e; }
      }

      // Reset derived fields
      cfg.projectStructure = null;
      cfg.backend = null;
      cfg.backendFramework = null;
      cfg.database = null;
      cfg.devPorts = null;
      // Reset design fields
      cfg.designMethod = null;
      cfg.designReference = null;
      cfg.breakpoints = null;

      // Remove dynamic scripts from package.json
      const rootPkg = JSON.parse(await fs.readFile(path.join(ROOT_DIR, "package.json"), "utf8"));
      delete rootPkg.scripts.dev;
      delete rootPkg.scripts.teardown;
      delete rootPkg.scripts.placeholders;
      await fs.writeFile(path.join(ROOT_DIR, "package.json"), JSON.stringify(rootPkg, null, 2) + "\n");
      console.log("  ✓ Cleaned package.json scripts\n");
    }

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

    /* ---- Auto-determine project structure ---- */
    const FULL_STACK = ["next", "nuxt"];
    if (FULL_STACK.includes(cfg.framework)) {
      cfg.projectStructure = "single";
      cfg.backend = "api-routes";
      cfg.backendFramework = null;
      cfg.database = "sqlite";
      cfg.devPorts = { app: 3000 };
    } else {
      cfg.projectStructure = "monorepo";
      cfg.backend = "separate";
      cfg.backendFramework = "hono";
      cfg.database = "sqlite";
      cfg.devPorts = { frontend: 5173, backend: 3000 };
    }

    console.log(`\n📐 Project structure: ${cfg.projectStructure}`);
    console.log(`   Backend: ${cfg.backend}`);
    if (cfg.backendFramework) console.log(`   Backend framework: ${cfg.backendFramework}`);
    console.log(`   Database: ${cfg.database}`);

    await writeConfig(cfg);                                                                                                                                                                                                                                           
                                                                                                                                                                                                                                                                     
      /* ---- Auto-configure PostToolUse hook for formatter ---- */                                                                                                                                                                                                  
      const settingsPath = path.join(CLAUDE_DIR, 'settings.json');
      let settings = {};                                                                                                                                                                                                                                             
      try {
        settings = JSON.parse(await fs.readFile(settingsPath, 'utf8'));                                                                                                                                                                                              
      } catch (e) {                                         
        if (e.code !== 'ENOENT') throw e;
      }                                                                                                                                                                                                                                                              
  
      if (!settings.hooks) settings.hooks = {};                                                                                                                                                                                                                      
      if (!settings.hooks.PostToolUse) settings.hooks.PostToolUse = [];
                                                                                                                                                                                                                                                                     
      // Remove existing format-on-save hook if present (idempotent)
      settings.hooks.PostToolUse = settings.hooks.PostToolUse.filter(                                                                                                                                                                                                
        (entry) => !entry.hooks?.some((h) => h.command?.includes('format-on-save')),                                                                                                                                                                                 
      );                                                                                                                                                                                                                                                             
                                                                                                                                                                                                                                                                     
      // Add PostToolUse formatter hook                                                                                                                                                                                                                              
      settings.hooks.PostToolUse.push({                     
        matcher: 'Edit|Write',
        hooks: [
          {                                                                                                                                                                                                                                                          
            type: 'command',
            command: 'cat | bash scripts/format-on-save.sh',                                                                                                                                                                                                         
          },                                                
        ],
      });

      await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2) + '\n');                                                                                                                                                                                 
      console.log('  ✓ PostToolUse formatter hook configured in .claude/settings.json');

    console.log("\n✅ project.config.json updated:");
    console.log(JSON.stringify(cfg, null, 2));

    /* ---- Scaffold project structure ---- */
    if (cfg.projectStructure === "monorepo") {
      console.log("\n=== Monorepo Scaffolding ===");

      // pnpm-workspace.yaml
      const wsPath = path.join(ROOT_DIR, "pnpm-workspace.yaml");
      await fs.writeFile(wsPath, 'packages:\n  - "frontend"\n  - "backend"\n');
      console.log("  ✓ pnpm-workspace.yaml");

      // frontend/package.json
      const feDir = path.join(ROOT_DIR, "frontend");
      await fs.mkdir(feDir, { recursive: true });
      await fs.writeFile(
        path.join(feDir, "package.json"),
        JSON.stringify({ name: "frontend", private: true, type: "module", scripts: {} }, null, 2) + "\n",
      );
      console.log("  ✓ frontend/package.json");

      // backend/package.json
      const beDir = path.join(ROOT_DIR, "backend");
      await fs.mkdir(beDir, { recursive: true });
      await fs.writeFile(
        path.join(beDir, "package.json"),
        JSON.stringify({ name: "backend", private: true, type: "module", scripts: {} }, null, 2) + "\n",
      );
      console.log("  ✓ backend/package.json");
    }

    // db/ directory (both paths need it)
    const dbDir = path.join(ROOT_DIR, "db");
    await fs.mkdir(dbDir, { recursive: true });
    await fs.writeFile(path.join(dbDir, ".gitkeep"), "");
    console.log("  ✓ db/");

    // .gitignore — add SQLite entry
    const giPath = path.join(ROOT_DIR, ".gitignore");
    let gi = "";
    try { gi = await fs.readFile(giPath, "utf8"); } catch {}
    if (!gi.includes("db/*.sqlite")) {
      gi += "\n# SQLite database files\ndb/*.sqlite*\n";
      await fs.writeFile(giPath, gi);
      console.log("  ✓ .gitignore updated");
    }

    /* ---- Add dev / teardown scripts to root package.json ---- */
    const rootPkgPath = path.join(ROOT_DIR, "package.json");
    const rootPkg = JSON.parse(await fs.readFile(rootPkgPath, "utf8"));
    if (cfg.projectStructure === "monorepo") {
      rootPkg.scripts.dev = "pnpm --parallel --filter frontend --filter backend dev";
    } else {
      rootPkg.scripts.dev = "pnpm --filter . dev";
    }
    rootPkg.scripts.teardown = "node scripts/teardown.mjs";
    rootPkg.scripts.placeholders = "node scripts/generate-placeholders.mjs";
    await fs.writeFile(rootPkgPath, JSON.stringify(rootPkg, null, 2) + "\n");
    console.log("  ✓ package.json scripts updated");

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
