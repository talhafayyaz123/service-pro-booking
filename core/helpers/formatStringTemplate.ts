import format from 'string-template'

export function formatStringTemplate(
  text: string,
  keysObject: Record<string, string | number>
) {
  if (!text) return ''

  return format(text, keysObject)
}
