export function removeDoubleSlashes(url: string): string {
  // This regex matches double slashes that are not part of the "http://" or "https://"
  return url.replace(/(https?:\/\/|[^:])\/{2,}/g, '$1/')
}
