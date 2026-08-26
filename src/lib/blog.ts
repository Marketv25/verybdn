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
