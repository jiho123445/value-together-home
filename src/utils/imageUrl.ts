/**
 * Image URL helper.
 *
 * Images uploaded to Firebase Storage receive a unique download URL, so they
 * are already cache-safe. Do not append Date.now()/sync timestamps here:
 * doing so forces the browser to re-download the same image after every
 * Firestore synchronization and makes the first page load noticeably slower.
 */
export function formatImageUrl(url?: string, _version?: number | string): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:')) return url;
  return url;
}

/**
 * Legacy API-image fallback helper.
 * Kept for compatibility with older callers, but it deliberately does not
 * add a changing cache-busting query parameter.
 */
export function getImageApiFallbackUrl(url?: string): string {
  if (!url || typeof url !== 'string') return '';
  if (url.startsWith('data:')) return url;
  const filename = url.split('?')[0].replace(/^\/uploads\//, '');
  return `/api/image/${filename}`;
}
