export function debounceFunction(func: any, timeout = 300) {
  let timer: any
  return (...args: any) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      //eslint-disable-next-line
      //@ts-ignore
      func.apply(this, args)
    }, timeout)
  }
}
