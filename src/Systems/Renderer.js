import { System } from 'ecsy'
import { Animated, Movable, Position, Static } from '../Components'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Renderer extends System {
  static queries = {
    // Entities that have an animation associated with them
    animated: {
      components: [Position, Animated]
    },
    // Entities that can be rendered as a static sprite
    static: {
      components: [Position, Static]
    }
  }

  renderAnimated = dt => entity => {
    const { x, y } = entity.getComponent(Position)
    const a = entity.getMutableComponent(Animated)

    const frameIndex = a.frameIndices[a.frame]
    const sprite = a.sprites[frameIndex]

    a.dt += dt
    if (a.dt > 1000 / a.fps) {
      a.dt = 0
      a.frame += 1
    }

    if (a.frame > a.frameIndices.length - 1) {
      a.frame = 0
    }

    ctx.drawImage(sprite, x, y)
  }

  renderStatic = entity => {
    const { x, y } = entity.getComponent(Position)
    const { sprite } = entity.getComponent(Static)

    ctx.drawImage(sprite, x, y)
  }

  execute(dt) {
    ctx.clearRect(0, 0, 600, 600)
    this.queries.animated.results.forEach(this.renderAnimated(dt))
    this.queries.static.results.forEach(this.renderStatic)
  }
}

export default Renderer
