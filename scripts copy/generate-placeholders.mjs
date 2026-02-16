// scripts/generate-placeholders.mjs
// Generates SVG placeholder images using Node.js built-in modules only.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const CONFIG_PATH = path.join(ROOT_DIR, "project.config.json");

/* =======================
   Presets
======================= */
const PRESETS = [
  { name: "avatar", width: 128, height: 128, label: "User", color: "#6366f1" },
  { name: "avatar-sm", width: 48, height: 48, label: "User", color: "#6366f1" },
  { name: "hero", width: 1280, height: 720, label: "Hero", color: "#0ea5e9" },
  { name: "thumbnail", width: 320, height: 180, label: "Thumb", color: "#8b5cf6" },
  { name: "card", width: 400, height: 300, label: "Card", color: "#14b8a6" },
  { name: "logo", width: 200, height: 60, label: "Logo", color: "#f59e0b" },
  { name: "banner", width: 1200, height: 400, label: "Banner", color: "#ec4899" },
  { name: "og", width: 1200, height: 630, label: "OG Image", color: "#06b6d4" },
];

/* =======================
   SVG generator
======================= */
function generateSvg({ width, height, label, color }) {
  const displayLabel = label || `${width}\u00d7${height}`;
  const fontSize = Math.max(12, Math.min(width, height) * 0.15);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${color}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="600"
        fill="rgba(255,255,255,0.85)">${displayLabel}</text>
  <text x="50%" y="${height * 0.5 + fontSize * 0.9}" dominant-baseline="central" text-anchor="middle"
        font-family="system-ui, sans-serif" font-size="${fontSize * 0.5}" font-weight="400"
        fill="rgba(255,255,255,0.55)">${width}\u00d7${height}</text>
</svg>
`;
}

/* =======================
   Output directory
======================= */
async function resolveOutputDir() {
  try {
    const cfg = JSON.parse(await fs.readFile(CONFIG_PATH, "utf8"));
    if (cfg.projectStructure === "monorepo") {
      return path.join(ROOT_DIR, "frontend", "public", "placeholders");
    }
    return path.join(ROOT_DIR, "public", "placeholders");
  } catch {
    // Default to public/placeholders if config is missing
    return path.join(ROOT_DIR, "public", "placeholders");
  }
}

/* =======================
   CLI
======================= */
async function main() {
  const { values } = parseArgs({
    options: {
      name: { type: "string" },
      width: { type: "string" },
      height: { type: "string" },
      label: { type: "string" },
      color: { type: "string" },
      clean: { type: "boolean", default: false },
      list: { type: "boolean", default: false },
    },
    strict: true,
  });

  /* ---- --list ---- */
  if (values.list) {
    console.log("Available presets:\n");
    console.log(
      "  Name         Width  Height  Label     Color",
    );
    console.log("  " + "-".repeat(50));
    for (const p of PRESETS) {
      console.log(
        `  ${p.name.padEnd(12)} ${String(p.width).padStart(5)}  ${String(p.height).padStart(6)}  ${p.label.padEnd(9)} ${p.color}`,
      );
    }
    return;
  }

  const outDir = await resolveOutputDir();

  /* ---- --clean ---- */
  if (values.clean) {
    try {
      const files = await fs.readdir(outDir);
      let count = 0;
      for (const f of files) {
        if (f.endsWith(".svg")) {
          await fs.unlink(path.join(outDir, f));
          count++;
        }
      }
      console.log(`Cleaned ${count} SVG file(s) from ${path.relative(ROOT_DIR, outDir)}/`);
    } catch (e) {
      if (e.code === "ENOENT") {
        console.log("Nothing to clean — placeholders directory does not exist.");
      } else {
        throw e;
      }
    }
    return;
  }

  /* ---- Custom mode ---- */
  if (values.name) {
    const width = Number(values.width);
    const height = Number(values.height);
    if (!width || !height || width <= 0 || height <= 0) {
      console.error("❌ --width and --height are required and must be positive numbers.");
      process.exit(1);
    }

    const label = values.label || null;
    const color = values.color || "#94a3b8";
    const svg = generateSvg({ width, height, label, color });

    await fs.mkdir(outDir, { recursive: true });
    const filePath = path.join(outDir, `${values.name}.svg`);
    await fs.writeFile(filePath, svg);
    console.log(`✓ ${path.relative(ROOT_DIR, filePath)}  (${width}×${height})`);
    return;
  }

  /* ---- Batch mode (default) ---- */
  console.log("=== Generating Placeholder Images ===\n");
  await fs.mkdir(outDir, { recursive: true });

  for (const preset of PRESETS) {
    const svg = generateSvg(preset);
    const filePath = path.join(outDir, `${preset.name}.svg`);
    await fs.writeFile(filePath, svg);
    console.log(`  ✓ ${path.relative(ROOT_DIR, filePath)}  (${preset.width}×${preset.height})`);
  }

  console.log(`\n✅ ${PRESETS.length} placeholder(s) generated in ${path.relative(ROOT_DIR, outDir)}/`);
}

main().catch((e) => {
  console.error(e.message ?? e);
  process.exit(1);
});
