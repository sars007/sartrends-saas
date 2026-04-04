export function isPreview() {
  return process.env.VERCEL_ENV === 'preview';
}

export function getPRNumber(): number | null {
  const ref = process.env.VERCEL_GIT_COMMIT_REF;
  if (!ref) return null;
  const match = ref.match(/pull\/(\d+)\//);
  return match ? parseInt(match[1], 10) : null;
}

export function isPR(): boolean {
  return isPreview() || !!getPRNumber();
}
