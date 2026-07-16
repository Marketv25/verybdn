import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const srcDir = './assets';
const destDir = './src/assets/img';

const mappings = [
  { src: 'hero.png', dest: 'hero.webp' },
  { src: 'galeria-01-cabana-exterior.png', dest: 'galeria-01-cabana-exterior.webp' },
  { src: 'galeria-02-rio.png', dest: 'galeria-02-rio.webp' },
  { src: 'galeria-03-sauna-exterior.png', dest: 'galeria-03-sauna-exterior.webp' },
  { src: 'galeria-04-fogata.png', dest: 'galeria-04-fogata.webp' },
  { src: 'espacio-1-habitacion.png', dest: 'espacio-1-habitacion.webp' },
  { src: 'espacio-2-baño.png', dest: 'espacio-2-bano.webp' },
  { src: 'espacio-3-refugio.png', dest: 'espacio-3-refugio.webp' },
  { src: 'espacio-4-fuego.png', dest: 'espacio-4-fuego.webp' },
  { src: 'espacio-5-cocina-exterior.png', dest: 'espacio-5-cocina-exterior.webp' },
  { src: 'mapa.png', dest: 'mapa.webp' }
];

async function convert() {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  for (const item of mappings) {
    const srcPath = path.join(srcDir, item.src);
    const destPath = path.join(destDir, item.dest);
    
    if (fs.existsSync(srcPath)) {
      console.log(`Converting ${item.src} to ${item.dest}...`);
      await sharp(srcPath)
        .webp({ quality: 85 })
        .toFile(destPath);
      console.log(`Saved to ${destPath}`);
    } else {
      console.error(`Source file not found: ${srcPath}`);
    }
  }
}

convert().catch(console.error);
