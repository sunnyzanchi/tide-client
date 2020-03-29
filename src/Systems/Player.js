import { System } from 'ecsy'
import Vector from 'victor'

import {
  Animated,
  Bounce,
  BoundingBox,
  KeyControlled,
  MouseControlled,
  Networked,
  Player as PlayerComponent,
  Position,
  Projectile,
  Static,
  Velocity,
} from '../Components'
import { sprites } from '../sprites'

const BULLET_BB = { x: 0, y: 0, w: 8, h: 8 }
const SPEED = 80

class Player extends System {
  static queries = {
    player: {
      components: [PlayerComponent]
    }
  }

  // TODO: Make this data-driven so different attacks can have different limits etc
  bulletLimiter = 0

  init() {
    // Have to do this in init since sprites are loaded async
    this.BULLET_SPRITE = { sprite: sprites.getSet('bullet').DEFAULT }
  }

  getAnimation(keys) {
    const animation = {
      fps: 5
    }

    if (keys.has('a')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_LEFT
      }
    }

    if (keys.has('d')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_RIGHT
      }
    }

    if (keys.has('w')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_UP
      }
    }

    if (keys.has('s')) {
      return {
        ...animation,
        ...sprites.getSet('player').WALK_DOWN
      }
    }
  }

  handleKeys = (keys, pos, vel, dt, player) => {
    if (keys.keys.size === 0) {
      this.stopMoving(player, vel)
      return
    }

    const left = keys.keys.has('a')
    const down = keys.keys.has('s')
    const up = keys.keys.has('w')
    const right = keys.keys.has('d')

    if (left) {
      vel.x = -SPEED
    }

    if (down) {
      vel.y = SPEED
    }

    if (up) {
      vel.y = -SPEED
    }

    if (right) {
      vel.x = SPEED
    }

    if (!left && !right) {
      vel.x = 0
    }

    if (!up && !down) {
      vel.y = 0
    }

    if (!left && !down && !up && !right) {
      this.stopMoving(player, vel)
      return
    }
    
    player.removeComponent(Static)

    const animation = this.getAnimation(keys.keys)

    if (player.hasComponent(Animated)) {
      const a = player.getMutableComponent(Animated)
      a.fps = animation.fps
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    } else {
      player.addComponent(Animated, animation)
    }
  }

  handleMouse = (mouse, pos, vel, dt) => {
    if (mouse.LMB && this.bulletLimiter === 0) {
      const vel = new Vector(mouse.x - pos.x, mouse.y - pos.y)
        .normalize()
        .multiplyScalar(128)
        .toObject()

      // Create bullet
      this.world
        .createEntity()
        .addComponent(BoundingBox, BULLET_BB)
        .addComponent(Networked)
        .addComponent(Projectile)
        .addComponent(Position, pos)
        .addComponent(Velocity, vel)
        .addComponent(Static, this.BULLET_SPRITE)
      this.bulletLimiter += dt

      return
    }

    if (this.bulletLimiter > 0 && this.bulletLimiter < 200) {
      this.bulletLimiter += dt
      return
    } else {
      this.bulletLimiter = 0
    }
  }

  stopMoving(player, vel) {
    player.removeComponent(Animated)
    player.addComponent(Static, { sprite: sprites.getSet('player').STANDING })

    vel.x = 0
    vel.y = 0
  }

  execute(dt) {
    const player = this.queries.player.results[0]

    // Not sure how big, if any, the performance gains are from doing this
    // Basically, we're calling all the getComponents here, so we only do them once
    // instead of multiple times inside each handle function
    const kc = player.getComponent(KeyControlled)
    const mc = player.getComponent(MouseControlled)
    const pos = player.getComponent(Position)
    const vel = player.getMutableComponent(Velocity)

    this.handleKeys(kc, pos, vel, dt, player)
    this.handleMouse(mc, pos, vel, dt, player)
  }
}

export default Player
