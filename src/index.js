import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

import { loadSprites, sprites } from './sprites'

const world = new World()

world
  .registerSystem(Systems.Controls)
  .registerSystem(Systems.Network)
  .registerSystem(Systems.Renderer)

loadSprites().then(() => {
    world
      .createEntity('player')
      .addComponent(Components.Controllable)
      .addComponent(Components.Networked)
      .addComponent(Components.Position)
      .addComponent(Components.Static, { sprite: sprites.getSet('player').STANDING })
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
