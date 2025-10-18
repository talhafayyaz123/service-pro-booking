export const getOrdered = <T extends { order: number }>(data?: T[]) => {
  if (!data) {
    return []
  }

  return data.sort((a, b) => a.order - b.order)
}
