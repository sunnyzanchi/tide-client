import { createSprites, flipRow } from './utils'
import crosshairimg from '../assets/crosshair.png'
import goblinimgs from '../assets/goblin.png'
import golemimgs from '../assets/golem.png'
import playerimgs from '../assets/player.png'

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

const loadCrosshair = () => createSprites(crosshairimg, 15, 15)
const loadGoblin = () => createSprites(goblinimgs, 64, 64)
const loadGolem = () => createSprites(golemimgs, 64, 64)

const loadPlayer = () =>
  createSprites(playerimgs, 16, 32).then(rows => {
    const flipped = flipRow(rows[2])
    return flipped.then(f => {
      rows.push(f)
      return rows
    })
  })

export const loadSprites = () =>
  Promise.all([loadCrosshair(), loadGoblin(), loadGolem(), loadPlayer()]).then(
    ([cs, gs, gos, ps]) => {
      const crosshair = {
        DEFAULT: cs[0][0]
      }

      const goblin = {
        STANDING: gs[0][0],
        WALK_DOWN: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gs[0]
        },
        WALK_RIGHT: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gs[1]
        },
        WALK_UP: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gs[2]
        },
        WALK_LEFT: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gs[3]
        }
      }

      const golem = {
        STANDING: gos[2][0],
        WALK_UP: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gos[0]
        },
        WALK_LEFT: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gos[1]
        },
        WALK_DOWN: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gos[2]
        },
        WALK_RIGHT: {
          frameIndices: [0, 1, 2, 3, 4, 5, 6],
          sprites: gos[3]
        }
      }

      const player = {
        STANDING: ps[0][0],
        WALK_DOWN: {
          frameIndices: [1, 1, 2, 2],
          sprites: ps[0]
        },
        WALK_RIGHT: {
          frameIndices: [0, 1, 0, 2],
          sprites: ps[2]
        },
        WALK_UP: {
          frameIndices: [1, 1, 2, 2],
          sprites: ps[1]
        },
        WALK_LEFT: {
          frameIndices: [0, 1, 0, 2],
          sprites: ps[3]
        }
      }

      sprites.addSet('crosshair', crosshair)
      sprites.addSet('goblin', goblin)
      sprites.addSet('golem', golem)
      sprites.addSet('player', player)
    }
  )
