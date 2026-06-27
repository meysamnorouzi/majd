import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import pngToIco from "png-to-ico";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const logoPath = path.join(root, "public/images/logo.png");
const appDir = path.join(root, "src/app");

const squareBuffer = await sharp(logoPath)
  .resize(512, 512, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const faviconSizes = [16, 32, 48];
const faviconPngs = await Promise.all(
  faviconSizes.map((size) =>
    sharp(squareBuffer).resize(size, size).png().toBuffer(),
  ),
);

await fs.writeFile(
  path.join(appDir, "favicon.ico"),
  await pngToIco(faviconPngs),
);
await sharp(squareBuffer).resize(32, 32).png().toFile(path.join(appDir, "icon.png"));
await sharp(squareBuffer)
  .resize(180, 180)
  .png()
  .toFile(path.join(appDir, "apple-icon.png"));

console.log("Generated favicon.ico, icon.png, and apple-icon.png from logo.");
