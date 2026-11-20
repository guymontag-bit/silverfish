// Shortens text to about maxLength characters, cutting at a word boundary.
export function excerpt(text: string, maxLength = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= maxLength) return clean

  const cut = clean.slice(0, maxLength)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > 0 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.trimEnd()}…`
}