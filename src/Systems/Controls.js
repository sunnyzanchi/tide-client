import { System } from 'ecsy'
import Vector from 'victor'

import {
  Animated,
  FollowMouse,
  KeyControlled,
  MouseControlled,
  Position,
  Static,
  Velocity
} from '../Components'
import { sprites } from '../sprites'

const animation = {
  fps: 5,
  frameIndices: [0, 1, 0, 2],
  sprites: []
}

const upAnimation = () => ({
  ...animation,
  frameIndices: sprites.getSet('player').WALK_UP.frameIndices,
  sprites: sprites.getSet('player').WALK_UP.sprites
})
const downAnimation = () => ({
  ...animation,
  frameIndices: sprites.getSet('player').WALK_DOWN.frameIndices,
  sprites: sprites.getSet('player').WALK_DOWN.sprites
})
const leftAnimation = () => ({
  ...animation,
  frameIndices: sprites.getSet('player').WALK_LEFT.frameIndices,
  sprites: sprites.getSet('player').WALK_LEFT.sprites
})
const rightAnimation = () => ({
  ...animation,
  frameIndices: sprites.getSet('player').WALK_RIGHT.frameIndices,
  sprites: sprites.getSet('player').WALK_RIGHT.sprites
})

class Controls extends System {
  static queries = {
    keyControlled: {
      components: [KeyControlled]
    },
    followMouse: {
      components: [FollowMouse]
    },
    mouseControlled: {
      components: [MouseControlled]
    }
  }

  bulletLimiter = 0

  keys = {
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    UP: false
  }

  mouse = {
    lastUpdate: 0,
    LMB: false,
    RMB: false,
    MMB: false,
    x: 0,
    y: 0
  }

  keyDown = e => {
    const key = e.key

    if (key === 'a') this.keys.LEFT = true
    if (key === 's') this.keys.DOWN = true
    if (key === 'w') this.keys.UP = true
    if (key === 'd') this.keys.RIGHT = true
  }

  keyUp = e => {
    const key = e.key

    if (key === 'a') this.keys.LEFT = false
    if (key === 's') this.keys.DOWN = false
    if (key === 'w') this.keys.UP = false
    if (key === 'd') this.keys.RIGHT = false
  }

  mouseMove = e => {
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
  }

  mouseDown = e => {
    this.mouse.LMB = true
  }

  // TODO: Fix quick click problem
  // If the player mousedowns then mousedups very quickly,
  // this.mouse.LMB === false when the tick runs and the bullet doesnt shoot
  mouseUp = e => {
    this.mouse.LMB = false
  }

  init() {
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
  }

  handleKeyControlled = dt => entity => {
    const position = entity.getMutableComponent(Position)

    if (Object.values(this.keys).every(val => !val)) {
      entity.removeComponent(Animated)
      entity.addComponent(Static, {
        sprite: sprites.getSet('player').STANDING
      })

      return
    }

    entity.removeComponent(Static)

    if (!entity.hasComponent(Animated)) {
      entity.addComponent(Animated)
    }

    const a = entity.getMutableComponent(Animated)
    a.fps = 5

    if (this.keys.DOWN) {
      const animation = downAnimation()
      position.y += Math.floor(dt * 0.11)
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    }
    if (this.keys.LEFT) {
      const animation = leftAnimation()
      position.x -= Math.floor(dt * 0.11)
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    }
    if (this.keys.RIGHT) {
      const animation = rightAnimation()
      position.x += Math.floor(dt * 0.11)
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    }
    if (this.keys.UP) {
      const animation = upAnimation()
      position.y -= Math.floor(dt * 0.11)
      a.frameIndices = animation.frameIndices
      a.sprites = animation.sprites
    }
  }

  handleFollowMouse = dt => entity => {
    const position = entity.getMutableComponent(Position)

    position.x = this.mouse.x
    position.y = this.mouse.y
  }

  handleMouseControlled = dt => entity => {
    if (this.mouse.LMB) {
      if (this.bulletLimiter === 0) {
        const pos = entity.getComponent(Position)
        const vel = new Vector(this.mouse.x - pos.x, this.mouse.y - pos.y)
          .normalize()
          .multiply(new Vector(64, 64))
          .toObject()
  
        // Create bullet
        this.world
          .createEntity()
          .addComponent(Position, pos)
          .addComponent(Velocity, vel)
          .addComponent(Static, { sprite: sprites.getSet('bullet').DEFAULT })
      }
      if (this.bulletLimiter < 200) {
        this.bulletLimiter += dt
        return
      } else {
        this.bulletLimiter = 0
      }
    }
  }

  execute(dt) {
    this.queries.keyControlled.results.forEach(this.handleKeyControlled(dt))
    this.queries.followMouse.results.forEach(this.handleFollowMouse(dt))
    this.queries.mouseControlled.results.forEach(this.handleMouseControlled(dt))
  }
}

export default Controls
