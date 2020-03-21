import { System } from 'ecsy'
import { Controllable, Position } from '../Components'

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

  execute() {
    this.queries.controllable.results.forEach(entity => {
      const position = entity.getMutableComponent(Position)

      if (this.keys.DOWN) {
        position.y += 1
      }
      if (this.keys.LEFT) {
        position.x -= 1
      }
      if (this.keys.RIGHT) {
        position.x += 1
      }
      if (this.keys.UP) {
        position.y -= 1
      }

    })
  }
}

export default Controls
