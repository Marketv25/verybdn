import fs from 'node:fs';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const SITE = 'https://verybdn.com';

/**
 * Fechas de cambio para el `lastmod` del sitemap, que Google usa para decidir qué volver a rastrear.
 * Solo se ponen donde la fecha es cierta: cada artículo (updatedDate o, si no, pubDate), y la portada
 * y el índice del blog de cada idioma, que cambian cuando entra un artículo nuevo en «Lo último».
 * Las guías de Minca y Río y Fuego no llevan: sin una fecha real, es mejor no dar ninguna.
 * Se lee el frontmatter a mano porque la configuración corre antes que las colecciones de contenido.
 */
function fechasDeCambio() {
  const dir = new URL('./src/content/blog/', import.meta.url);
  const fechas = new Map();
  const ultima = {};
  for (const nombre of fs.readdirSync(dir)) {
    if (!nombre.endsWith('.md')) continue;
    const fm = fs.readFileSync(new URL(nombre, dir), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fm) continue;
    const campo = (k) => (fm[1].match(new RegExp(`^${k}:\\s*"?([^"\\r\\n]*)"?\\s*$`, 'm')) || [])[1]?.trim() ?? '';
    if (campo('draft') === 'true') continue;
    const fecha = new Date(campo('updatedDate') || campo('pubDate'));
    if (Number.isNaN(fecha.valueOf())) continue;
    const lang = campo('lang') === 'es' ? 'es' : 'en';
    const raiz = lang === 'es' ? `${SITE}/es/` : `${SITE}/`;
    fechas.set(`${raiz}blog/${nombre.replace(/\.md$/, '')}/`, fecha);
    if (!ultima[lang] || fecha > ultima[lang]) ultima[lang] = fecha;
  }
  for (const [lang, fecha] of Object.entries(ultima)) {
    const raiz = lang === 'es' ? `${SITE}/es/` : `${SITE}/`;
    fechas.set(raiz, fecha);
    fechas.set(`${raiz}blog/`, fecha);
  }
  return fechas;
}

const fechas = fechasDeCambio();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      serialize(item) {
        const fecha = fechas.get(item.url);
        if (fecha) item.lastmod = fecha.toISOString();
        return item;
      },
    }),
  ],
});
