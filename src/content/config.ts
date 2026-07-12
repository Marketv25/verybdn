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

export const collections = {
  'lugares': lugaresCollection,
};
