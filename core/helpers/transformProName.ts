export const transformProName = (firstName = '', lastName = '') => {
  return `${firstName ? firstName + ' ' : ''} ${lastName}`
}
