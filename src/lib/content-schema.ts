import { z } from 'zod';

export const blogEntrySchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  category: z.string(),
  tags: z.array(z.string()),
  featured: z.boolean().optional(),
  series: z.string().optional(),
});

export type BlogEntryFrontmatter = z.infer<typeof blogEntrySchema>;
