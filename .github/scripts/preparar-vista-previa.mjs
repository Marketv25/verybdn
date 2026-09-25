// Convierte el build del sitio (dist/) en una vista previa para GitHub Pages, sin tocar la indexación
// de verybdn.com. Solo se usa en .github/workflows/vista-previa.yml; el despliegue real no pasa por aquí.
//
//   node .github/scripts/preparar-vista-previa.mjs dist /verybdn "nombre-de-la-rama"
//
// - Cada página lleva <meta name="robots" content="noindex, nofollow">. Las canónicas y los hreflang ya
//   apuntan a https://verybdn.com (vienen de `site` en astro.config.mjs), así que aunque Google viera una
//   copia, sabría cuál es el original.
// - Las rutas que empiezan por "/" pasan a empezar por la base (/verybdn/): en Pages el sitio vive en
//   https://marketv25.github.io/verybdn/, no en la raíz. Enlaces, imágenes, srcset, scripts y url() de CSS.
// - Una franja arriba avisa de que es una vista previa y de qué rama.
// - Se quitan sitemap y robots.txt: la vista previa no tiene nada que ofrecer a un buscador.
import fs from 'node:fs';
import path from 'node:path';

const [dir = 'dist', baseCruda = '/verybdn', rama = ''] = process.argv.slice(2);
const base = '/' + baseCruda.replace(/^\/+|\/+$/g, '');

const conBase = (url) => (url.startsWith('/') && !url.startsWith('//') && !url.startsWith(base + '/') ? base + url : url);
const escapar = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const NOINDEX = '<meta name="robots" content="noindex, nofollow"><meta name="googlebot" content="noindex, nofollow">';
const FRANJA = `<div style="position:sticky;top:0;z-index:99999;background:#1A1814;color:#F2ECE0;font:500 13px/1.4 system-ui,sans-serif;` +
  `padding:8px 16px;text-align:center;letter-spacing:.02em">VISTA PREVIA${rama ? ` · rama <code style="color:#E8C9A0">${escapar(rama)}</code>` : ''}` +
  ` · no es el sitio publicado · <a href="https://verybdn.com/" style="color:#E8C9A0">verybdn.com</a></div>`;   // se añade después de reescribir: sí va al sitio real

function reescribirUrls(texto) {
  return texto
    // enlaces <a> escritos con la dirección completa del sitio (el conmutador de idioma, por ejemplo): se quedan
    // dentro de la vista previa. Las canónicas y los hreflang (<link>) NO se tocan: siguen en verybdn.com.
    .replace(/(<a\b[^>]*?\shref\s*=\s*)(["'])https:\/\/verybdn\.com(\/[^"']*)\2/gi, (m, attr, q, ruta) => `${attr}${q}${base}${ruta}${q}`)
    // atributos con una sola URL
    .replace(/(\s(?:href|src|action|poster|data-src)\s*=\s*)(["'])(\/[^"']*)\2/gi, (m, attr, q, url) => `${attr}${q}${conBase(url)}${q}`)
    // srcset: varias URL separadas por comas
    .replace(/(\ssrcset\s*=\s*)(["'])([^"']*)\2/gi, (m, attr, q, lista) =>
      `${attr}${q}${lista.split(',').map((parte) => parte.replace(/^(\s*)(\/\S*)/, (x, esp, url) => esp + conBase(url))).join(',')}${q}`)
    // url(...) en CSS, también en estilos en línea
    .replace(/url\(\s*(["']?)(\/[^)"']*)\1\s*\)/gi, (m, q, url) => `url(${q}${conBase(url)}${q})`);
}

let paginas = 0;
let hojas = 0;
function recorrer(carpeta) {
  for (const nombre of fs.readdirSync(carpeta)) {
    const ruta = path.join(carpeta, nombre);
    if (fs.statSync(ruta).isDirectory()) { recorrer(ruta); continue; }
    if (nombre.endsWith('.html')) {
      let html = fs.readFileSync(ruta, 'utf8');
      html = reescribirUrls(html);
      html = html.replace(/<meta\s+name=["']robots["'][^>]*>/gi, '');
      html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (h) => h + NOINDEX) : NOINDEX + html;
      html = html.replace(/<body[^>]*>/i, (b) => b + FRANJA);
      fs.writeFileSync(ruta, html);
      paginas++;
    } else if (nombre.endsWith('.css')) {
      fs.writeFileSync(ruta, reescribirUrls(fs.readFileSync(ruta, 'utf8')));
      hojas++;
    }
  }
}

recorrer(dir);
for (const f of fs.readdirSync(dir)) {
  if (/^sitemap.*\.xml$/.test(f) || f === 'robots.txt') fs.rmSync(path.join(dir, f));
}
console.log(`Vista previa lista: ${paginas} páginas con noindex, ${hojas} hojas de estilo, base ${base}${rama ? `, rama ${rama}` : ''}.`);
