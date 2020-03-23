import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

import { sprites as spriteBank } from './sprites'
import { createSprites, flipRow } from './spriteUtils'

import charimgs from './assets/characterSpritesheet.png'

const world = new World()

world
  .registerSystem(Systems.Controls)
  .registerSystem(Systems.Network)
  .registerSystem(Systems.Renderer)

createSprites(charimgs, 16, 32)
  .then(rows => {
    const flipped = flipRow(rows[2])
    return flipped.then(f => {
      rows.push(f)
      return rows
    })
  })
  .then(sprites => {
    const player = {
      STANDING: sprites[0][0],
      WALKING_DOWN: {
        frameIndices: [1, 1, 2, 2],
        sprites: sprites[0]
      },
      WALKING_RIGHT: {
        frameIndices: [0, 1, 0, 2],
        sprites: sprites[2]
      },
      WALKING_UP: {
        frameIndices: [1, 1, 2, 2],
        sprites: sprites[1]
      },
      WALKING_LEFT: {
        frameIndices: [0, 1, 0, 2],
        sprites: sprites[3]
      }
    }

    spriteBank.player = player

    world
      .createEntity('player')
      .addComponent(Components.Controllable)
      .addComponent(Components.Networked)
      .addComponent(Components.Position)
      .addComponent(Components.Static, { sprite: sprites[0][0] })
  })

let lastTime = performance.now()

const run = () => {
  // Compute delta and elapsed time
  const time = performance.now()
  const delta = time - lastTime

  // Run all the systems
  world.execute(delta, time)

  lastTime = time
  requestAnimationFrame(run)
}

run()
