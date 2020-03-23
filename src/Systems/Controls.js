import { System } from 'ecsy'
import { Animated, Controllable, Position, Static } from '../Components'
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
    controllable: {
      components: [Controllable]
    }
  }

  keys = {
    DOWN: false,
    LEFT: false,
    RIGHT: false,
    UP: false
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

  init() {
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)
  }

  execute(dt) {
    this.queries.controllable.results.forEach(entity => {
      const position = entity.getMutableComponent(Position)

      if (Object.values(this.keys).every(val => !val)) {
        entity.removeComponent(Animated)
        entity.addComponent(Static, { sprite: sprites.getSet('player').STANDING })

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
    })
  }
}

export default Controls
