const loadImage = url =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.src = url

    img.onload = () => resolve(img)
    img.onerror = err => reject(err)
  })

// Spritesheets should have one animation per row
export const createSprites = (url, l, h) =>
  loadImage(url).then(img => {
    const numCols = img.width / l
    const numRows = img.height / h

    const sprites = []

    for (let row = 0; row < numRows; row += 1) {
      sprites.push([])

      for (let col = 0; col < numCols; col += 1) {
        sprites[row].push(
          createImageBitmap(img, l * col, h * row, l, h)
        )
      }
    }

    return Promise.all(sprites.map(rows => Promise.all(rows)))
  })

export const flipRow = (row, horizontal) => {
  const canvas = document.createElement('canvas')

  return Promise.all(row.map(r => flipSprite(r, horizontal, canvas)))
}

export const flipSprite = (img, horizontal = true, canvas) => {
  if (canvas == null) {
    canvas = document.createElement('canvas')
  }
  canvas.width = img.width
  canvas.height = img.height

  const ctx = canvas.getContext('2d')

  ctx.translate(img.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(img, 0, 0)

  return createImageBitmap(canvas)
}