import { defineCollection, z } from 'astro:content';

const lugaresCollection = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    name: z.string(),
    city: z.string(),
    categories: z.array(z.string()),
    descripcionCorta: z.string(),
    whatsapp: z.string(),
    whatsappMensaje: z.string(),
    tour360Url: z.string().url().optional(),
    posterImage: image(),
    coordenadas: z.object({
      lat: z.number(),
      lng: z.number(),
    }),
    direccion: z.string(),
    ordenCuracion: z.number(),
  }),
});

/**
 * Colección del blog.
 *
 * La escribe el motor de contenido en n8n, que hace commit de un .md aquí.
 * El schema es la frontera: si el frontmatter no cuadra, `astro build` falla
 * en GitHub Actions y el paso de FTP no llega a ejecutarse, así que producción
 * nunca ve un post malformado.
 */
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(165),
    /** Las primeras 40-60 palabras, autocontenidas. Es el bloque que los
     *  motores generativos extraen y citan, y también alimenta llms.txt. */
    directAnswer: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /**
     * `travel` habla a viajeros; `operators`, a dueños de alojamientos;
     * `coast` es la pieza puente, la que leen los dos y donde la contradicción
     * entre ambos intereses es justamente el tema.
     */
    cluster: z.enum(['travel', 'operators', 'coast']),
    lang: z.enum(['en', 'es']).default('en'),
    /** Se pinta sobre el título, como "Minca guides · Layer 1" en las guías. */
    eyebrow: z.string().optional(),
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    sources: z
      .array(z.object({ title: z.string(), url: z.string().url() }))
      .default([]),
    ogImage: z.string().optional(),
    /**
     * Identificador compartido por las dos versiones de un mismo artículo.
     * De aquí sale el emparejamiento en / es: el `hreflang` y el conmutador de
     * idioma se calculan solos, sin que nadie escriba una URL a mano.
     */
    translationKey: z.coerce.string().optional(),
    /** Escotilla de escape: fuerza el equivalente cuando no hay par en la colección. */
    alternateUrl: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'lugares': lugaresCollection,
  'blog': blogCollection,
};
