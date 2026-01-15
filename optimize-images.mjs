import sharp from 'sharp';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

const imgDir = './data/img';
const files = readdirSync(imgDir);

// Critical images that need optimization
const criticalImages = [
    'mamclogo_nobg.png',
    'synapse_nobg.png',
    'mavericksr.png',
    'krafton.webp',
    'erangle.jpg',
    'miramar.jpg',
    'sanhok.jpg',
    'rondo.jpg',
    'KRAFTONL.jpg'
];

for (const file of files) {
    const filePath = join(imgDir, file);
    const stat = statSync(filePath);
    
    if (!stat.isFile()) continue;
    
    // Process PNG and JPG files
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
        const baseName = file.replace(/\.(png|jpg|jpeg)$/i, '');
        const outputWebP = join(imgDir, `${baseName}.webp`);
        
        try {
            const image = sharp(filePath);
            const metadata = await image.metadata();
            
            // Optimize based on image size
            let quality = 85;
            if (metadata.width > 500 || metadata.height > 500) {
                quality = 80; // Lower quality for larger images
            }
            
            await image
                .webp({ quality, effort: 6 })
                .toFile(outputWebP);
            
            const originalSize = stat.size;
            const newSize = statSync(outputWebP).size;
            const savings = ((originalSize - newSize) / originalSize * 100).toFixed(1);
            
            console.log(`✓ ${file} → ${baseName}.webp (${(originalSize/1024).toFixed(1)}KB → ${(newSize/1024).toFixed(1)}KB, saved ${savings}%)`);
        } catch (error) {
            console.error(`✗ Failed to process ${file}:`, error.message);
        }
    }
}

console.log('\n✓ Image optimization complete!');
