import type { CollectionEntry } from 'astro:content';

import { describe, expect, it } from 'vitest';

import { getRelatedPosts } from '@/utils/post-utils';

function makePost(
  id: string,
  tags: string[],
  category: string,
  pubDate: string,
): CollectionEntry<'blog'> {
  return {
    id,
    slug: id.replace(/\/index\.mdx?$/, ''),
    body: '',
    data: {
      title: id,
      description: '',
      pubDate: new Date(pubDate),
      category,
      tags,
    },
  } as CollectionEntry<'blog'>;
}

describe('getRelatedPosts', () => {
  const posts = [
    makePost('rust-ownership', ['Rust', 'Ownership'], 'Programming Languages', '2025-10-01'),
    makePost('rust-variables', ['Rust', 'Variables'], 'Programming Languages', '2025-10-15'),
    makePost('git-basics', ['Git', 'Beginner'], 'Version Control', '2025-09-01'),
    makePost('haskell-intro', ['Haskell', 'Functional Programming'], 'Programming Languages', '2025-08-01'),
    makePost('touch-typing', ['Productivity', 'Skill Development'], 'Career & Soft Skills', '2025-11-01'),
  ];

  it('excludes the current post', () => {
    const result = getRelatedPosts(posts, 'rust-ownership', ['Rust'], 'Programming Languages');
    expect(result.every(p => p.id !== 'rust-ownership')).toBe(true);
  });

  it('scores +2 per matching tag', () => {
    const result = getRelatedPosts(posts, 'git-basics', ['Rust', 'Beginner'], 'Version Control');
    const ids = result.map(p => p.id);
    // Both rust posts share "Rust" tag → score 2 each, tie-break by date
    expect(ids[0]).toBe('rust-variables'); // Oct 15 > Oct 1
    expect(ids[1]).toBe('rust-ownership');
  });

  it('scores +1 for matching category', () => {
    const result = getRelatedPosts(posts, 'touch-typing', [], 'Programming Languages');
    // rust-ownership, rust-variables, haskell-intro all share category → score 1 each
    // Tie-broken by date: rust-variables (Oct 15) > rust-ownership (Oct 1) > haskell (Aug 1)
    const ids = result.map(p => p.id);
    expect(ids).toContain('rust-variables');
    expect(ids).toContain('rust-ownership');
  });

  it('combines tag and category scores', () => {
    const result = getRelatedPosts(posts, 'git-basics', ['Rust'], 'Version Control');
    const ids = result.map(p => p.id);
    // rust-ownership: tag "Rust" (+2) + no category match = 2
    // rust-variables: tag "Rust" (+2) + no category match = 2
    // git-basics excluded
    // Others: score 0
    expect(ids[0]).toMatch(/rust/);
  });

  it('tie-breaks by pubDate (newer first)', () => {
    const result = getRelatedPosts(posts, 'git-basics', ['Rust'], 'Nonexistent');
    const ids = result.map(p => p.id);
    // Both rust posts have score 2 (tag only), tie-break by date
    expect(ids[0]).toBe('rust-variables'); // Oct 15 > Oct 1
  });

  it('falls back to most recent when no matches', () => {
    const result = getRelatedPosts(posts, 'git-basics', ['Nonexistent'], 'Nonexistent');
    const ids = result.map(p => p.id);
    // No matching tags or categories → fallback to most recent
    expect(ids[0]).toBe('touch-typing'); // Nov 1 is newest
  });

  it('respects the limit parameter', () => {
    const result = getRelatedPosts(posts, 'touch-typing', [], '', 2);
    expect(result.length).toBe(2);
  });

  it('defaults to limit of 3', () => {
    const result = getRelatedPosts(posts, 'touch-typing', [], '');
    expect(result.length).toBeLessThanOrEqual(3);
  });
});
