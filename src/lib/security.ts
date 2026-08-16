export function isSafeImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return true;
  }

  if (trimmed.startsWith('data:image/')) {
    return true;
  }

  if (/^(javascript|vbscript|data|file|ftp):/i.test(trimmed)) {
    return false;
  }

  if (trimmed.startsWith('//')) {
    return false;
  }

  return false;
}
