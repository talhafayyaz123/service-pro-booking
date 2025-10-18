export const getHeaderToken = (token: string) => {
  return {
    Authorization: `Bearer ${token}`,
  }
}
