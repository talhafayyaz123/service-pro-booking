export const getOS = (): 'Windows' | 'Linux' | 'MacOs' | undefined => {
  if (navigator.userAgent.includes('Windows')) return 'Windows'
  if (navigator.userAgent.includes('Linux')) return 'Linux'
  if (navigator.userAgent.includes('Mac')) return 'MacOs'
}
