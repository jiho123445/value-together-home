import { describe, it, expect } from 'vitest';
import { formatImageUrl, getImageApiFallbackUrl } from './imageUrl';

describe('formatImageUrl', () => {
  it('returns an empty string for missing or non-string input', () => {
    expect(formatImageUrl(undefined)).toBe('');
    // @ts-expect-error deliberately testing a bad-input guard
    expect(formatImageUrl(123)).toBe('');
  });

  it('passes data URLs through unchanged', () => {
    const dataUrl = 'data:image/png;base64,AAAA';
    expect(formatImageUrl(dataUrl)).toBe(dataUrl);
  });

  it('keeps normal URLs unchanged so browser/CDN caching can work', () => {
    expect(formatImageUrl('/uploads/photo.jpg', 42)).toBe('/uploads/photo.jpg');
    expect(formatImageUrl('/static/logo.png', 7)).toBe('/static/logo.png');
  });

  it('preserves Firebase signed download URLs and their query parameters', () => {
    const url = 'https://firebasestorage.googleapis.com/v0/b/example/o/photo.jpg?alt=media&token=abc123';
    expect(formatImageUrl(url, 42)).toBe(url);
  });
});

describe('getImageApiFallbackUrl', () => {
  it('returns an empty string for missing input', () => {
    expect(getImageApiFallbackUrl(undefined)).toBe('');
  });

  it('passes data URLs through unchanged', () => {
    const dataUrl = 'data:image/png;base64,AAAA';
    expect(getImageApiFallbackUrl(dataUrl)).toBe(dataUrl);
  });

  it('rewrites an /uploads/ path without a changing cache-busting parameter', () => {
    expect(getImageApiFallbackUrl('/uploads/photo.jpg?v=1')).toBe('/api/image/photo.jpg');
  });
});
