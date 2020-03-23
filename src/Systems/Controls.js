import { System } from 'ecsy'
import { Controllable, Movable, Position} from '../Components'

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
    UP: false,
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
      const moving = entity.getMutableComponent(Movable)
      const position = entity.getMutableComponent(Position)

      if (this.keys.DOWN) {
        position.y += Math.floor(dt * 0.11)
        moving.direction = 'down'
      }
      if (this.keys.LEFT) {
        position.x -= Math.floor(dt * 0.11)
        moving.direction = 'left'
      }
      if (this.keys.RIGHT) {
        position.x += Math.floor(dt * 0.11)
        moving.direction = 'right'
      }
      if (this.keys.UP) {
        position.y -= Math.floor(dt * 0.11)
        moving.direction = 'up'
      }

      if (Object.values(this.keys).every(val => !val)) {
        moving.direction = 'none'
      }
    })
  }
}

export default Controls
