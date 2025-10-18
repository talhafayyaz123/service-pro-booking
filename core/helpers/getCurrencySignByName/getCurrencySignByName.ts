export const getCurrencySignByName = (name?: string) => {
  if (!name) {
    return '$'
  }
  switch ((name || '').toLowerCase()) {
    case 'usd':
      return '$'
    case 'aed':
      return 'د.إ'
    case '':
      return ''
    case '$':
      return '$'
    case 'د.إ':
      return 'د.إ'
    default:
      return '$'
  }
}
