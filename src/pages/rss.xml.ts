import type { APIContext } from 'astro';

import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const posts = await getCollection('blog');

  const sorted = posts
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(post => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id.replace(/\/index\.(md|mdx)$/, '').replace(/\.(md|mdx)$/, '')}/`,
      categories: [post.data.category],
      tags: post.data.tags,
    }));

  return rss({
    title: 'rxdevman',
    description: 'A developer\'s living knowledge base, curated by a pharmacist turned programmer.',
    site: context.site!,
    items: sorted,
    customData: '<language>en</language>',
  });
}
