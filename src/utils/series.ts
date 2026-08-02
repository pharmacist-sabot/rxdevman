import type { CollectionEntry } from 'astro:content';

import { getEntrySlug } from '@/utils/slugify';

export type SeriesGroup = {
  name: string;
  posts: CollectionEntry<'blog'>[];
};

/**
 * Group blog posts by their series field.
 * Posts without a series are excluded.
 */
export function groupPostsBySeries(
  posts: CollectionEntry<'blog'>[],
): SeriesGroup[] {
  const seriesMap = new Map<string, CollectionEntry<'blog'>[]>();

  for (const post of posts) {
    const series = post.data.series;
    if (!series)
      continue;

    const existing = seriesMap.get(series) ?? [];
    existing.push(post);
    seriesMap.set(series, existing);
  }

  return Array.from(seriesMap.entries())
    .map(([name, seriesPosts]) => ({
      name,
      posts: seriesPosts.sort(
        (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get the previous and next post in a series.
 */
export function getSeriesNav(
  posts: CollectionEntry<'blog'>[],
  currentSlug: string,
): { prev: CollectionEntry<'blog'> | null; next: CollectionEntry<'blog'> | null } {
  const sorted = posts.sort(
    (a, b) => a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );
  const idx = sorted.findIndex(p => getEntrySlug(p.id) === currentSlug);

  if (idx === -1)
    return { prev: null, next: null };

  return {
    prev: idx > 0 ? sorted[idx - 1] : null,
    next: idx < sorted.length - 1 ? sorted[idx + 1] : null,
  };
}
