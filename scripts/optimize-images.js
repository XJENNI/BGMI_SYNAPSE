/**
 * Simple image optimizer script using sharp
 * Generates AVIF and WebP at multiple widths for JPG/PNG images in data/img
 * Usage: node scripts/optimize-images.js
 * Requires: npm install sharp
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const inputDir = path.join(__dirname, '..', 'data', 'img');
const outDir = path.join(inputDir, 'optimized');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const widths = [320, 640, 1280];
const formats = ['webp', 'avif'];

async function processFile(file) {
  const ext = path.extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

  const name = path.basename(file, ext);
  const inputPath = path.join(inputDir, file);

  for (const w of widths) {
    for (const fmt of formats) {
      const outName = `${name}-${w}.${fmt}`;
      const outPath = path.join(outDir, outName);
      try {
        const pipeline = sharp(inputPath).resize({ width: w }).toFormat(fmt, fmt === 'avif' ? { quality: 50 } : { quality: 70 });
        await pipeline.toFile(outPath);
        console.log('WROTE', outPath);
      } catch (err) {
        console.error('ERROR processing', inputPath, err);
      }
    }
  }
}

async function run() {
  const files = fs.readdirSync(inputDir);
  for (const file of files) {
    await processFile(file);
  }
}

run().then(() => console.log('Done')).catch(err => console.error(err));