import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

const world = new World()

world
  .registerSystem(Systems.Controls)
  .registerSystem(Systems.Network)
  .registerSystem(Systems.Renderer)

world
  .createEntity()
  .addComponent(Components.Controllable)
  .addComponent(Components.Networked)
  .addComponent(Components.Position)
  .addComponent(Components.Renderable)

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
