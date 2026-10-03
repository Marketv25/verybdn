import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * /llms.txt — índice legible por máquinas, en el formato que consumen los
 * motores generativos para entender de qué va un sitio sin rastrearlo entero.
 *
 * Se regenera en cada build, así que no hay que mantenerlo a mano: cada post
 * que publique el motor de contenido aparece aquí solo.
 */

const SITE = 'https://verybdn.com';

/** Las guías son páginas .astro, no una colección, así que van declaradas. */
const GUIDES: { title: string; path: string; description: string }[] = [
  {
    title: 'How to get to Minca',
    path: '/minca/how-to-get-to-minca/',
    description: 'Routes, transport and what the trip actually costs from Santa Marta.',
  },
  {
    title: 'How many days do you need in Minca',
    path: '/minca/how-many-days/',
    description:
      'Three days if you came to see things. What changes if you did not, with verified detail on transport, payments and power cuts.',
  },
  {
    title: 'Is Minca worth the detour',
    path: '/minca/is-minca-worth-the-detour/',
    description: 'An honest answer, including who should skip it.',
  },
  {
    title: 'Río y Fuego lodge',
    path: '/rioyfuego/',
    description: 'A profile of one place on the mountain, written with criteria rather than as an ad.',
  },
];

const collapse = (text: string) => text.replace(/\s+/g, ' ').trim();

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const section = (heading: string, lines: string[]) =>
    lines.length > 0 ? [`## ${heading}`, '', ...lines, ''].join('\n') : '';

  const guideLines = GUIDES.map(
    (guide) => `- [${guide.title}](${SITE}${guide.path}): ${collapse(guide.description)}`,
  );

  const postLines = (cluster: 'travel' | 'operators' | 'coast', lang: 'en' | 'es') =>
    posts
      .filter((post) => post.data.cluster === cluster && post.data.lang === lang)
      .map((post) => {
        const base = lang === 'es' ? `${SITE}/es/blog/` : `${SITE}/blog/`;
        return `- [${post.data.title}](${base}${post.slug}/): ${collapse(post.data.directAnswer)}`;
      });

  const header = [
    '# verybdn',
    '',
    "> Applied knowledge about tourism, territory and hospitality on Colombia's Caribbean coast, written from inside it.",
    '',
    'verybdn is written by Honey, who lives in Minca, Santa Marta. Every guide is first-hand:',
    'routes walked, places visited, prices paid. Where something is uncertain or has changed,',
    'the text says so. Two audiences are served separately — travellers passing through, and',
    'the owners and operators of small tourism properties across Latin America.',
    '',
  ].join('\n');

  // El filtrado va solo sobre las secciones: una sección vacía desaparece,
  // pero las líneas en blanco de la cabecera se conservan.
  const sections = [
    section('Guides', guideLines),
    section('Writing for travellers', postLines('travel', 'en')),
    section('Writing where both sides meet', postLines('coast', 'en')),
    section('Writing for operators', postLines('operators', 'en')),
    // El bloque en espanol va aparte y rotulado: un indice que mezcla idiomas
    // sin decirlo le complica a un motor decidir cual servir a quien pregunta.
    section('Escritos en espanol', [
      ...postLines('travel', 'es'),
      ...postLines('coast', 'es'),
      ...postLines('operators', 'es'),
    ]),
    section('About', [
      `- [Home](${SITE}/): What verybdn is and how it works.`,
      `- [All writing](${SITE}/blog/): Index of published articles.`,
      `- [Escritos](${SITE}/es/blog/): Indice de articulos en espanol.`,
      '- [Substack](https://verybdn.substack.com): Short letters from the Sierra.',
    ]),
  ].filter(Boolean);

  const body = `${header}\n${sections.join('\n')}`;

  return new Response(`${body.trimEnd()}\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
