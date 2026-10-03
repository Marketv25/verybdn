import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Lógica compartida por las dos versiones de idioma del blog.
 *
 * Las páginas `/blog/[...slug]` y `/es/blog/[...slug]` renderizan lo mismo con
 * distinto idioma, así que todo lo que decide QUÉ se muestra vive aquí y el
 * cómo vive en `components/BlogPost.astro`. Duplicar esto en dos plantillas era
 * garantizar que se separasen a la tercera vez que alguien tocara una.
 */

export type Lang = 'en' | 'es';
export type Cluster = 'travel' | 'operators' | 'coast';
export type BlogPost = CollectionEntry<'blog'>;

/** Los borradores se ven en `astro dev` pero nunca se construyen para producción. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  return await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
}

export function sortByDate(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export const blogBase = (lang: Lang) => (lang === 'es' ? '/es/blog/' : '/blog/');

export const postPath = (lang: Lang, slug: string) => `${blogBase(lang)}${slug}/`;

/**
 * Construye las rutas de un idioma, emparejando cada artículo con su
 * traducción por `translationKey`. Ese emparejamiento es lo que hace que el
 * `hreflang` y el conmutador de idioma salgan solos: nadie escribe una URL de
 * traducción a mano, así que no pueden desincronizarse.
 */
export async function buildPostPaths(lang: Lang) {
  const todos = await getPublishedPosts();
  const porFecha = sortByDate(todos);
  const propios = porFecha.filter((post) => post.data.lang === lang);
  const otros = porFecha.filter((post) => post.data.lang !== lang);

  return propios.map((post) => {
    const par = post.data.translationKey
      ? otros.find((otro) => otro.data.translationKey === post.data.translationKey)
      : undefined;

    return {
      params: { slug: post.slug },
      props: {
        post,
        // Solo se declara traducción cuando existe de verdad. Apuntar el
        // hreflang a un índice sería anunciar una página que no está.
        alternateUrl:
          post.data.alternateUrl ??
          (par ? `https://verybdn.com${postPath(par.data.lang as Lang, par.slug)}` : undefined),
        related: propios
          .filter((otro) => otro.slug !== post.slug && otro.data.cluster === post.data.cluster)
          .slice(0, 2),
      },
    };
  });
}

interface ClusterCopy {
  id: Cluster;
  eyebrow: string;
  title: string;
  lede: string;
  empty: string;
}

/**
 * Los tres hilos. `coast` va en medio a propósito: es el puente entre los otros
 * dos, y ponerlo al final lo dejaría pareciendo un cajón de sastre.
 */
export const clusterCopy: Record<Lang, ClusterCopy[]> = {
  en: [
    {
      id: 'travel',
      eyebrow: 'For the ones passing through',
      title: 'What nobody tells you until you are already here.',
      lede: 'The guides answer the questions you ask before booking. These are the ones that come up after — the thing that turned out to be different, the plan that needed changing, the detail that only matters once you are standing in it.',
      empty: 'Nothing here yet. The guides are the place to start.',
    },
    {
      id: 'coast',
      eyebrow: 'Where both sides meet',
      title: 'The same coast, seen from both ends of the transaction.',
      lede: 'What a place costs to visit and what it costs to run are the same question asked from opposite sides. These pieces answer it once, for both.',
      empty: 'Nothing here yet.',
    },
    {
      id: 'operators',
      eyebrow: 'For the ones who stayed',
      title: 'Running a small place, without grinding it down.',
      lede: 'Written for whoever owns the hostel, the lodge, the four rooms above the café. You have something real. Turning it into a business without flattening what made it worth visiting is the actual problem, and almost nobody writes about it honestly.',
      empty: 'Nothing here yet.',
    },
  ],
  es: [
    {
      id: 'travel',
      eyebrow: 'Para quien está de paso',
      title: 'Lo que nadie te cuenta hasta que ya estás aquí.',
      lede: 'Las guías responden a lo que se pregunta antes de reservar. Esto es lo que aparece después: lo que resultó ser distinto, el plan que hubo que cambiar, el detalle que solo importa cuando ya estás dentro.',
      empty: 'Todavía no hay nada. Las guías son un buen sitio para empezar.',
    },
    {
      id: 'coast',
      eyebrow: 'Donde se encuentran los dos lados',
      title: 'La misma costa, vista desde los dos extremos del trato.',
      lede: 'Lo que cuesta visitar un lugar y lo que cuesta sostenerlo son la misma pregunta hecha desde lados opuestos. Estas piezas la responden una sola vez, para los dos.',
      empty: 'Todavía no hay nada.',
    },
    {
      id: 'operators',
      eyebrow: 'Para quien se quedó',
      title: 'Llevar un lugar pequeño sin desgastarlo.',
      lede: 'Escrito para quien tiene el hostal, el lodge, las cuatro habitaciones encima del café. Tienes algo real. Convertirlo en negocio sin aplanar lo que lo hacía valer la pena es el problema de verdad, y casi nadie escribe sobre eso con honestidad.',
      empty: 'Todavía no hay nada.',
    },
  ],
};

export const threadLabels: Record<Lang, Record<Cluster, string>> = {
  en: {
    travel: 'For the ones passing through',
    operators: 'For the ones who stayed',
    coast: 'Where both sides meet',
  },
  es: {
    travel: 'Para quien está de paso',
    operators: 'Para quien se quedó',
    coast: 'Donde se encuentran los dos lados',
  },
};

export const postCopy: Record<Lang, Record<string, string>> = {
  en: {
    by: 'By',
    published: 'Published',
    updated: 'Updated',
    faq: 'Frequently asked questions',
    sources: 'Sources',
    back: 'All writing',
    keep: 'Keep reading',
    read: 'Read',
    minutes: 'min read',
    shortAnswer: 'The short answer',
    contents: 'In this piece',
    supports: 'Cited for',
    aboutTitle: 'Who writes this',
    aboutBody:
      'Honey lives in Minca, in the Sierra Nevada. What is here comes from living and working in the territory these pages cover, not from visiting it for a week. Where something is seasonal or has changed, the text says so.',
  },
  es: {
    by: 'Por',
    published: 'Publicado',
    updated: 'Actualizado',
    faq: 'Preguntas frecuentes',
    sources: 'Fuentes',
    back: 'Todos los escritos',
    keep: 'Seguir leyendo',
    read: 'Leer',
    minutes: 'min de lectura',
    shortAnswer: 'En corto',
    contents: 'En este artículo',
    supports: 'Respalda',
    aboutTitle: 'Quién escribe esto',
    aboutBody:
      'Honey vive en Minca, en la Sierra Nevada. Lo que hay aquí sale de vivir y trabajar en el territorio que estas páginas cubren, no de visitarlo una semana. Cuando algo depende de la temporada o ha cambiado, el texto lo dice.',
  },
};

/** Fecha en UTC siempre: `pubDate` es medianoche UTC y sin fijarlo la zona de
 *  quien construya la pintaría un día antes, sin coincidir con el JSON-LD. */
export function formatDate(date: Date, lang: Lang, style: 'long' | 'short' = 'long') {
  return date.toLocaleDateString(lang === 'es' ? 'es-CO' : 'en-US', {
    year: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/*
 * Lo que la página del artículo saca del propio texto, sin pedirle al motor
 * ningún campo nuevo: tiempo de lectura, cifras citadas y para qué se cita
 * cada fuente. Todo sale del Markdown que ya escribe el motor.
 */

interface Source { title: string; url: string }

export interface CitedFigure {
  figure: string;
  caption: string;
  source: string;
  date?: Date;
}

export interface SourceCard extends Source {
  domain: string;
  date?: Date;
  cites: string[];
}

/** Dinero (COP, US$, $) y porcentajes, en formato inglés y español. */
const FIGURE =
  /(?:COP\s?\$?\s?|US\$\s?|USD\s?|\$\s?)\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?(?:\s(?:mil millones|millones|millón|million|billion))?|\d+(?:[.,]\d+)?\s?%/;

const MD_LINK = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g;

/** El mismo criterio que la comprobación del motor: sin barra final, host en minúsculas, sin utm_. */
function normUrl(url: string) {
  try {
    const u = new URL(url);
    u.hostname = u.hostname.toLowerCase();
    for (const clave of [...u.searchParams.keys()]) if (clave.startsWith('utm_')) u.searchParams.delete(clave);
    return u.toString().replace(/\/+$/, '').replace(/\/\?/, '?');
  } catch {
    return url.replace(/\/+$/, '');
  }
}

/** Los medios suelen llevar la fecha en la ruta (/2025/05/13/). Si no, no se inventa. */
export function dateFromUrl(url: string): Date | undefined {
  const m = url.match(/\/(20\d\d)\/(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\//);
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : undefined;
}

function cuerpo(body: string) {
  return body.replace(/\r\n/g, '\n').replace(/<!--[\s\S]*?-->/g, '');
}

const sinMarcas = (texto: string) =>
  texto.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();

export function readingMinutes(body: string) {
  const palabras = sinMarcas(cuerpo(body)).split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(palabras / 220));
}

/** Cada enlace del texto a una fuente, con el párrafo en el que está. */
function enlaces(body: string, sources: Source[]) {
  const porUrl = new Map(sources.map((s) => [normUrl(s.url), s]));
  const out: { text: string; source: Source; parrafo: string }[] = [];
  for (const parrafo of cuerpo(body).split(/\n\s*\n/)) {
    for (const m of parrafo.matchAll(MD_LINK)) {
      const source = porUrl.get(normUrl(m[2]));
      if (source) out.push({ text: m[1].trim(), source, parrafo });
    }
  }
  return out;
}

/**
 * Las cifras que se destacan en grande. Solo las que van DENTRO del texto de
 * un enlace a una fuente del artículo: esa es la frase que la fuente respalda.
 * Una cifra sin fuente no se agranda, aunque esté en el texto.
 */
export function citedFigures(body: string, sources: Source[], max = 3): CitedFigure[] {
  const vistas = new Set<string>();
  const out: CitedFigure[] = [];
  for (const { text, source, parrafo } of enlaces(body, sources)) {
    const m = text.match(FIGURE);
    if (!m || vistas.has(m[0])) continue;
    vistas.add(m[0]);
    let caption = text.replace(m[0], '').replace(/^[\s,;:—–-]+|[\s,;:—–-]+$/g, '');
    if (caption.split(' ').length < 3) {
      // Con dos palabras no se entiende sola: se usa la frase entera en la que va.
      const frase = sinMarcas(parrafo).split(/(?<=[.!?])\s+/).find((f) => f.includes(m[0]));
      caption = frase && frase.length <= 220 ? frase : text;
    }
    out.push({ figure: m[0], caption, source: source.title, date: dateFromUrl(source.url) });
    if (out.length === max) break;
  }
  return out;
}

/** Las fuentes como tarjetas: medio, fecha si la URL la trae, y la frase que respaldan. */
export function sourceCards(body: string, sources: Source[]): SourceCard[] {
  const citas = enlaces(body, sources);
  return sources.map((source) => {
    let domain = source.url;
    try { domain = new URL(source.url).hostname.replace(/^www\./, ''); } catch {}
    const cites = [...new Set(citas.filter((c) => c.source === source).map((c) => sinMarcas(c.text)))].slice(0, 2);
    return { ...source, domain, date: dateFromUrl(source.url), cites };
  });
}
