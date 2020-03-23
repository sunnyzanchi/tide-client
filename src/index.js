import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

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
    const animatedSettings = {
      sprites: {
        WALKING_DOWN: {
          frames: [0, 1, 0, 2],
          sprites: sprites[0]
        },
        WALKING_RIGHT: {
          frames: [0, 1, 0, 2],
          sprites: sprites[2]
        },
        WALKING_UP: {
          frames: [0, 1, 0, 2],
          sprites: sprites[1]
        },
        WALKING_LEFT: {
          frames: [0, 1, 0, 2],
          sprites: sprites[3]
        }
      },
      fps: 5
    }

    world
      .createEntity('player')
      .addComponent(Components.Animated, animatedSettings)
      .addComponent(Components.Controllable)
      .addComponent(Components.Movable, { direction: 'down' })
      .addComponent(Components.Networked)
      .addComponent(Components.Position)
      .addComponent(Components.Renderable, { sprite: sprites[0][0] })
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
