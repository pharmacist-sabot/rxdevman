import { describe, expect, it } from 'vitest';

import { blogEntrySchema } from '@/lib/content-schema';

const valid = {
  title: 'Hello Rust',
  description: 'A post about Rust.',
  pubDate: '2026-01-15',
  category: 'Programming Languages',
  tags: ['Rust', 'Beginner'],
};

describe('blogEntrySchema', () => {
  it('accepts valid frontmatter', () => {
    expect(blogEntrySchema.safeParse(valid).success).toBe(true);
  });

  it('accepts valid frontmatter with optional fields', () => {
    const result = blogEntrySchema.safeParse({
      ...valid,
      featured: true,
      series: 'Rust from Scratch',
    });
    expect(result.success).toBe(true);
  });

  it('coerces a string pubDate to a Date', () => {
    const result = blogEntrySchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.pubDate).toBeInstanceOf(Date);
    }
  });

  it.each([
    ['title'],
    ['description'],
    ['pubDate'],
    ['category'],
    ['tags'],
  ])('rejects missing required field: %s', (field) => {
    const input = Object.fromEntries(
      Object.entries(valid).filter(([key]) => key !== field),
    );
    expect(blogEntrySchema.safeParse(input).success).toBe(false);
  });

  it.each([
    'not-a-date',
    '2026-13-40',
    '',
  ])('rejects invalid pubDate: %s', (pubDate) => {
    expect(blogEntrySchema.safeParse({ ...valid, pubDate }).success).toBe(false);
  });

  it.each([
    ['category', 123],
    ['category', null],
    ['tags', 'Rust'],
    ['tags', ['Rust', 42]],
    ['title', 123],
    ['description', false],
  ])('rejects invalid value for %s: %s', (field, value) => {
    expect(blogEntrySchema.safeParse({ ...valid, [field]: value }).success).toBe(false);
  });

  it('strips unknown fields', () => {
    const result = blogEntrySchema.safeParse({ ...valid, bogus: true });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty('bogus');
    }
  });
});
