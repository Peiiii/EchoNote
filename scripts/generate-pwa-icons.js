import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputSvg = path.join(__dirname, "../public/echonote-icon-modern.svg");
const outputDir = path.join(__dirname, "../public");

const sizes = [
  { size: 72, name: "pwa-72x72.png" },
  { size: 96, name: "pwa-96x96.png" },
  { size: 128, name: "pwa-128x128.png" },
  { size: 144, name: "pwa-144x144.png" },
  { size: 152, name: "pwa-152x152.png" },
  { size: 192, name: "pwa-192x192.png" },
  { size: 384, name: "pwa-384x384.png" },
  { size: 512, name: "pwa-512x512.png" },
];

async function generateIcons() {
  try {
    console.log("Generating PWA icons...");

    for (const { size, name } of sizes) {
      const outputPath = path.join(outputDir, name);

      await sharp(inputSvg).resize(size, size).png().toFile(outputPath);

      console.log(`Generated ${name} (${size}x${size})`);
    }

    console.log("All PWA icons generated successfully!");
  } catch (error) {
    console.error("Error generating icons:", error);
    process.exit(1);
  }
}

generateIcons();
