export const checkForRestrictedWords = (
  text: string | undefined,
  restrictedWords: string[],
  setDetectedRestrictedWords: React.Dispatch<React.SetStateAction<string[]>>,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const content = text ?? ''
  const detectedWords = restrictedWords.filter((word) =>
    content.toLowerCase().includes(word?.toLowerCase())
  )
  if (detectedWords.length > 0) {
    setDetectedRestrictedWords(detectedWords)
    setShowModal(true)
    return true
  }
  return false
}
