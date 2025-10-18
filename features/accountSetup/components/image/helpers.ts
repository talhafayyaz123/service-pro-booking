import { Area } from 'react-easy-crop/types'

export const createImage = (url: string) => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous' // Needed to avoid cross-origin issues
    image.src = url
    image.onload = () => resolve(image)
    image.onerror = (error) => reject(error)
  })
}

export async function getCroppedImg(imageSrc: string, pixelCrop: Area) {
  const image = (await createImage(imageSrc)) as HTMLImageElement
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  // Set the canvas size to the original image dimensions
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)

  // Create another canvas for the cropped image
  let croppedCanvas = document.createElement('canvas')
  const croppedCtx = croppedCanvas.getContext('2d')

  if (!croppedCtx) return null

  // Set the size of the cropped image based on the crop area
  croppedCanvas.width = pixelCrop.width
  croppedCanvas.height = pixelCrop.height

  // Draw the cropped image onto the new canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  )

  // Resize the image if its width is greater than 1500px
  if (croppedCanvas.width > 1500) {
    const aspectRatio = croppedCanvas.height / croppedCanvas.width
    const newWidth = 1500
    const newHeight = newWidth * aspectRatio

    // Create a new canvas to resize the cropped image
    const resizedCanvas = document.createElement('canvas')
    const resizedCtx = resizedCanvas.getContext('2d')

    if (!resizedCtx) return null

    resizedCanvas.width = newWidth
    resizedCanvas.height = newHeight

    // Draw the resized image on the new canvas
    resizedCtx.drawImage(
      croppedCanvas,
      0,
      0,
      croppedCanvas.width,
      croppedCanvas.height,
      0,
      0,
      newWidth,
      newHeight
    )

    // Use the resized canvas for the blob conversion
    croppedCanvas = resizedCanvas
  }

  // Convert the canvas to a Blob and generate a URL for it
  const blob = new Promise((resolve, reject) => {
    croppedCanvas.toBlob(
      (blob) => {
        if (blob) {
          // Check if the blob size exceeds 10 MB (10,485,760 bytes)
          if (blob.size > 10485760) {
            reject('Cropped image exceeds the maximum allowed size of 10 MB.')
            return
          }
          resolve(URL.createObjectURL(blob))
        } else {
          reject('Canvas toBlob failed.')
        }
      },
      'image/png',
      1 // quality parameter, from 0 to 1
    )
  })

  // Convert the Blob URL to a File object
  const file = await blobUrlToFile((await blob) as string, 'cropped-image.png')

  // Return both the Blob URL and the File
  return {
    blob: await blob,
    file,
  }
}

// Convert a Blob URL to a File
export const blobUrlToFile = async (blobUrl: string, fileName: string) => {
  const response = await fetch(blobUrl)
  const blob = await response.blob()
  const file = new File([blob], fileName, { type: blob.type })
  return file
}

// Read a file and return its Data URL
export function readFile(file: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.addEventListener('load', () => resolve(reader.result), false)
    reader.readAsDataURL(file)
  })
}
