import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = path.join(root, "public", "images");
const outDir = path.join(root, "public", "opt", "images");
const manifestPath = path.join(root, "src", "lib", "media", "image-manifest.json");

/** Match Next.js default imageSizes + deviceSizes, plus a few in-between. */
const TARGET_WIDTHS = [
  16, 32, 48, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1600, 1920, 2048,
];

const SKIP_NAME_RE = /^chatgpt image/i;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name) && !SKIP_NAME_RE.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function needsBuild(srcPath, destPath) {
  try {
    const [srcStat, destStat] = await Promise.all([
      fs.stat(srcPath),
      fs.stat(destPath),
    ]);
    return srcStat.mtimeMs > destStat.mtimeMs;
  } catch {
    return true;
  }
}

async function optimizeFile(filePath) {
  const rel = path.relative(sourceDir, filePath).replaceAll("\\", "/");
  const parsed = path.parse(rel);
  const publicSrc = `/images/${rel}`;
  const meta = await sharp(filePath).metadata();
  const sourceWidth = meta.width || 0;
  if (!sourceWidth) return { src: publicSrc, widths: [] };

  const widths = [
    ...new Set(
      TARGET_WIDTHS.filter((w) => w <= sourceWidth).concat(sourceWidth),
    ),
  ].sort((a, b) => a - b);

  const isPng = (meta.format || "").toLowerCase() === "png";
  const quality = isPng ? 80 : 75;
  const built = [];

  for (const width of widths) {
    const destRel = path
      .join(parsed.dir, `${parsed.name}-w${width}.webp`)
      .replaceAll("\\", "/");
    const destPath = path.join(outDir, destRel);
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    if (await needsBuild(filePath, destPath)) {
      await sharp(filePath)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4, alphaQuality: 80 })
        .toFile(destPath);
    }
    built.push(width);
  }

  return { src: publicSrc, widths: built };
}

const files = await walk(sourceDir);
const manifest = {};
let generated = 0;

for (const file of files) {
  const result = await optimizeFile(file);
  if (result.widths.length) {
    manifest[result.src] = { widths: result.widths };
    generated += 1;
  }
}

await fs.mkdir(path.dirname(manifestPath), { recursive: true });
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Optimized ${generated} images → public/opt/images (${Object.keys(manifest).length} manifest entries)`,
);
