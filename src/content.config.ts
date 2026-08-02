import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

import { blogEntrySchema } from '@/lib/content-schema';

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => blogEntrySchema.extend({
    heroImage: image().optional(),
  }),
});

export const collections = {
  blog: blogCollection,
};
