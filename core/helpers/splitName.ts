export const splitName = (name: string) => {
  const splittedName = name?.split(' ')
  const firstName =
    name?.includes(' ') && splittedName && splittedName.length > 1
      ? splittedName[0]
      : ''
  const lastName =
    name?.includes(' ') && splittedName && splittedName.length > 1
      ? splittedName[1]
      : ''

  return { firstName, lastName }
}
