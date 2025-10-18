declare module 'redux-persist/lib/storage'

declare global {
  interface Window {
    opera: any
    MSStream: any
  }
}

window.opera = window.opera || {}
window.MSStream = window.MSStream || {}
