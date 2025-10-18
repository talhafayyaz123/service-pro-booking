// Function to validate if the ID is a direct-link (UUID)
export const isDirectId = (id: string): boolean => {
  const uuidRegex =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
  return uuidRegex.test(id) // Returns true if valid, false otherwise
}
