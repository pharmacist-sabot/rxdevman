import { describe, expect, it } from 'vitest';

import { getEntrySlug, slugify } from '@/utils/slugify';

describe('slugify', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('strips non-word characters', () => {
    expect(slugify('hello! @world#')).toBe('hello-world');
  });

  it('collapses multiple hyphens', () => {
    expect(slugify('a---b')).toBe('a-b');
  });

  it('trims leading and trailing hyphens', () => {
    expect(slugify('-hello-')).toBe('hello');
  });

  it('handles Thai characters (stripped by regex)', () => {
    // Thai characters are non-word, so they get stripped
    expect(slugify('สวัสดี Hello')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles only special characters', () => {
    expect(slugify('!@#$%')).toBe('');
  });

  it('handles string with numbers', () => {
    expect(slugify('post 123')).toBe('post-123');
  });
});

describe('getEntrySlug', () => {
  it('strips /index.mdx extension', () => {
    expect(getEntrySlug('my-post/index.mdx')).toBe('my-post');
  });

  it('strips /index.md extension', () => {
    expect(getEntrySlug('my-post/index.md')).toBe('my-post');
  });

  it('strips .mdx extension', () => {
    expect(getEntrySlug('my-post.mdx')).toBe('my-post');
  });

  it('strips .md extension', () => {
    expect(getEntrySlug('my-post.md')).toBe('my-post');
  });

  it('handles nested paths', () => {
    expect(getEntrySlug('category/my-post/index.mdx')).toBe('category/my-post');
  });

  it('returns as-is if no extension', () => {
    expect(getEntrySlug('my-post')).toBe('my-post');
  });
});
