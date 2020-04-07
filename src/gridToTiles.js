/**
 * Take a 2d matrix of numbers and return a 2d matrix with the appropriate tile names
 * @example
 * const grid = [
 *   [1, 1, 1, 1, 1]
 *   [1, 0, 0, 0, 1]
 *   [1, 1, 1, 1, 1]
 * ]
 * 
 * gridToTiles(grid)
 * // [
 *   ['TOP_LEFT', 'TOP', 'TOP', ...],
 *   ['LEFT', 'EMPTY', 'EMPTY', ...]
 *   ...
 * ]
 * @param {Number[][]} grid
 * @returns {String[][]}
 */
// TODO: Fix bottom (returns top for bottom atm)
export const gridToTiles = grid => {
  const tiles = []

  for (let ri = 0; ri < grid.length; ri++) {
    tiles.push([])
    for (let ci = 0; ci < grid[ri].length; ci++) {
      const above = grid[ri - 1] && grid[ri - 1][ci]
      const below = grid[ri + 1] && grid[ri + 1][ci]
      const left = grid[ri][ci - 1]
      const right = grid[ri][ci + 1]

      if (grid[ri][ci] === 0) {
        tiles[ri].push('EMPTY')
        continue
      }

      if (above && below && left && right) {
        tiles[ri].push('FILL')
        continue
      }

      if (left && right) {
        if (!below) {
          tiles[ri].push('TOP1')
          continue
        } else {
          tiles[ri].push('BOTTOM')
          continue
        }
      }

      if (right && below) {
        tiles[ri].push('TOP_LEFT')
        continue
      }

      if (left && below) {
        tiles[ri].push('TOP_RIGHT')
        continue
      }

      if (right && above) {
        tiles[ri].push('TOP1')
        continue
      }

      if (left && above) {
        tiles[ri].push('TOP1')
        continue
      }

      // We need to figure out if this is a left side or right side wall
      if (above) {
        let aboveIndex = ri - 1
        let currentAbove = tiles[aboveIndex][ci]

        if (currentAbove === 'LEFT') {
          tiles[ri].push('LEFT')
          continue
        }
        if (currentAbove === 'RIGHT') {
          tiles[ri].push('RIGHT')
          continue
        }

        while (currentAbove !== 'TOP_LEFT' && currentAbove !== 'TOP_RIGHT') {
          debugger
          aboveIndex--
        }

        if (currentAbove === 'TOP_LEFT') {
          tiles[ri].push('LEFT')
          continue
        } else {
          tiles[ri].push('RIGHT')
          continue
        }
      }
    }
  }

  return tiles
}
