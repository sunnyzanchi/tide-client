import { createSprites, flipRow } from './spriteUtils'
import charimgs from './assets/characterSpritesheet.png'

class SpriteManager {
  sprites = {}
  
  /**
   * Add a set of sprites at key `name`
   * @param {String} name 
   * @param {Object.<string, ImageBitmap[]} spritemap
   */
  addSet(name, spritemap) {
    if (process.env.NODE_ENV === 'development') {
      if (this.sprites[name] != undefined) {
        console.warn(`Key ${name} is alread set, overriding`)
      }
    }

    this.sprites[name] = spritemap
    return this
  }

  /**
   * Returns the set of sprites at key `name`
   * @param {String} name 
   * @returns {Object}
   */
  getSet(name) {
    return this.sprites[name]
  }
}

export const sprites = new SpriteManager()

export const loadSprites = () =>
  createSprites(charimgs, 16, 32)
    .then(rows => {
      const flipped = flipRow(rows[2])
      return flipped.then(f => {
        rows.push(f)
        return rows
      })
    })
    .then(s => {
      const player = {
        STANDING: s[0][0],
        WALKING_DOWN: {
          frameIndices: [1, 1, 2, 2],
          sprites: s[0]
        },
        WALKING_RIGHT: {
          frameIndices: [0, 1, 0, 2],
          sprites: s[2]
        },
        WALKING_UP: {
          frameIndices: [1, 1, 2, 2],
          sprites: s[1]
        },
        WALKING_LEFT: {
          frameIndices: [0, 1, 0, 2],
          sprites: s[3]
        }
      }

      sprites.addSet('player', player)
    })
    
