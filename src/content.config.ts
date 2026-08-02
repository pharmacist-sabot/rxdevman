import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: image().optional(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    series: z.string().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
