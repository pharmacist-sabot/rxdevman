import { describe, expect, it } from 'vitest';

import { calculateReadingTime } from '@/utils/reading-time';

describe('calculateReadingTime', () => {
  it('returns null for empty content', () => {
    expect(calculateReadingTime('')).toBeNull();
  });

  it('returns null for whitespace-only content', () => {
    expect(calculateReadingTime('   \n\t  ')).toBeNull();
  });

  it('returns "1 min read" for short content', () => {
    expect(calculateReadingTime('hello world')).toBe('1 min read');
  });

  it('calculates based on 200 words per minute', () => {
    const words = Array.from({ length: 200 }).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe('1 min read');
  });

  it('rounds up for partial minutes', () => {
    const words = Array.from({ length: 201 }).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe('2 min read');
  });

  it('calculates multi-minute reading time', () => {
    const words = Array.from({ length: 600 }).fill('word').join(' ');
    expect(calculateReadingTime(words)).toBe('3 min read');
  });

  it('trims whitespace before counting', () => {
    const words = Array.from({ length: 200 }).fill('word').join(' ');
    expect(calculateReadingTime(`  ${words}  `)).toBe('1 min read');
  });

  it('handles multiple whitespace between words', () => {
    const words = Array.from({ length: 100 }).fill('word').join('   ');
    expect(calculateReadingTime(words)).toBe('1 min read');
  });
});
