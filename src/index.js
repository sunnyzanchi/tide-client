import { World } from 'ecsy'

import * as Systems from './Systems'
import * as Components from './Components'

import { loadSounds, sounds } from './sounds'
import { loadSprites, sprites } from './sprites'

const world = new World()

let lastTime = performance.now()

const run = () => {
  // Compute delta and elapsed times
  const time = performance.now()
  const delta = time - lastTime

  // Run all the systems
  world.execute(delta, time)

  lastTime = time
  requestAnimationFrame(run)
}

Promise.all([loadSprites(), loadSounds()]).then(() => {
  world
    .registerSystem(Systems.Controls)
    .registerSystem(Systems.Player)
    // .registerSystem(Systems.Network)
    .registerSystem(Systems.Crosshair)
    .registerSystem(Systems.Collision)
    .registerSystem(Systems.Movement)
    .registerSystem(Systems.Combat)
    .registerSystem(Systems.Audio)
    .registerSystem(Systems.Renderer)

  world
    .createEntity('player')
    .addComponent(Components.BoundingBox, { x: 0, y: 0, w: 16, h: 32 })
    .addComponent(Components.Health, { max: 100, value: 100 })
    .addComponent(Components.KeyControlled)
    .addComponent(Components.Mass, { value: 10 })
    .addComponent(Components.MouseControlled)
    .addComponent(Components.Networked)
    .addComponent(Components.Player)
    .addComponent(Components.Position, { x: 50, y: 50 })
    .addComponent(Components.Slide)
    .addComponent(Components.Velocity)
    .addComponent(Components.Static, {
      sprite: sprites.getSet('player').STANDING
    })

  world
    .createEntity('sword')
    .addComponent(Components.BoundingBox, { x: 0, y: 0, w: 14, h: 18 })
    .addComponent(Components.Pickable, { pickupSound: sounds.get('knifeDraw') })
    .addComponent(Components.Position, { x: 100, y: 200 })
    .addComponent(Components.Static, { sprite: sprites.getSet('items').SWORD })

  world
    .createEntity('enemy-1')
    .addComponent(Components.BoundingBox, { x: 10, y: 10, w: 45, h: 48 })
    .addComponent(Components.Enemy)
    .addComponent(Components.Health, { max: 100, value: 50 })
    .addComponent(Components.Mass, { value: 100 })
    .addComponent(Components.Position, { x: 65, y: 45 })
    .addComponent(Components.Static, {
      sprite: sprites.getSet('golem').STANDING
    })

  world
    .createEntity('crosshair')
    .addComponent(Components.Position)
    .addComponent(Components.Crosshair)
    .addComponent(Components.MouseControlled)
    .addComponent(Components.Static, {
      centered: true,
      sprite: sprites.getSet('crosshair').DEFAULT
    })

  for (let i = 1; i < 20; i++) {
    world
      .createEntity(`wall-${i}`)
      .addComponent(Components.BoundingBox, { x: 0, y: 0, w: 32, h: 16 })
      .addComponent(Components.Mass, { value: 11 })
      .addComponent(Components.Position, { x: i * 32, y: 0 })
      .addComponent(Components.Static, {
        sprite: sprites.getSet('walls').TOP1,
        w: 32,
        h: 32
      })
  }
  world
    .createEntity('wall-tl')
    .addComponent(Components.BoundingBox, { x: 0, y: 0, w: 32, h: 16 })
    .addComponent(Components.Mass, { value: 11 })
    .addComponent(Components.Position, { x: 0, y: 0 })
    .addComponent(Components.Static, {
      sprite: sprites.getSet('walls').TOP_LEFT,
      w: 32,
      h: 32
    })

  for (let i = 1; i < 20; i++) {
    world
      .createEntity(`lwall-${i}`)
      .addComponent(Components.BoundingBox, { x: 0, y: 0, w: 10, h: 32 })
      .addComponent(Components.Mass, { value: 11 })
      .addComponent(Components.Position, { x: 0, y: i * 32 })
      .addComponent(Components.Static, {
        sprite: sprites.getSet('walls').LEFT,
        w: 32,
        h: 32
      })
  }

  run()
})
