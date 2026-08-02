import { describe, expect, it } from 'vitest';

import { sha256 } from '@/lib/hash';

describe('sha256', () => {
  it('returns a 64-character hex string', async () => {
    const hash = await sha256('hello');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('produces consistent hashes for the same input', async () => {
    const a = await sha256('test-input');
    const b = await sha256('test-input');
    expect(a).toBe(b);
  });

  it('produces different hashes for different inputs', async () => {
    const a = await sha256('input-a');
    const b = await sha256('input-b');
    expect(a).not.toBe(b);
  });

  it('produces different hashes for different salts', async () => {
    const a = await sha256('192.168.1.1salt-a');
    const b = await sha256('192.168.1.1salt-b');
    expect(a).not.toBe(b);
  });

  it('handles empty string', async () => {
    const hash = await sha256('');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('handles unicode characters', async () => {
    const hash = await sha256('สวัสดี');
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it('known SHA-256 vector: "hello" matches expected', async () => {
    const hash = await sha256('hello');
    // SHA-256("hello") = 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824
    expect(hash).toBe('2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824');
  });
});
