export const getValidSubdomain = (host?: string | null) => {
  const currentHost = new URL(process.env.NEXT_PUBLIC_SITE_URL || '').hostname
  let subdomain: string | null = null

  if (!host && typeof window !== 'undefined') {
    // On client side, get the host from window
    host = window.location.host
  }
  // eslint-disable-next-line no-console
  console.log('host', host)
  if (host && host.includes('.')) {
    const [candidate, ...hostParts] = host.split('.')

    // Keep log for checking
    // eslint-disable-next-line no-console
    // console.log(
    //   '>>> ValidSubdomain: [currentHost] [candidate] [candidateHost] =>',
    //   currentHost,
    //   candidate,
    //   hostParts.join('.')
    // )
    let isCurrentHost = currentHost === hostParts.join('.')
    const isLocalhost =
      candidate.includes('localhost') || candidate.includes('127')
    const isProd = process.env.NODE_ENV !== 'development'
    if (!isProd) {
      isCurrentHost = true
    }

    if (candidate && !isLocalhost && isCurrentHost) {
      // Valid candidate
      subdomain = candidate
    }
  }

  return subdomain
}
