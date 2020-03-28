import { System } from 'ecsy'
import {
  Animated,
  BoundingBox,
  Colliding,
  Movable,
  Position,
  Static
} from '../Components'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.strokeStyle = 'limegreen'
ctx.lineWidth = '1px'

class Renderer extends System {
  static queries = {
    // Entities that have an animation associated with them
    animated: {
      components: [Position, Animated]
    },
    // Entities that can be rendered as a static sprite
    static: {
      components: [Position, Static]
    },
    bb: {
      components: [Position, BoundingBox]
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

    if (process.env.NODE_ENV === 'development') {
      if (sprite == null) {
        console.warn(
          `Got null sprite trying to draw ${entity.name} on frame ${frameIndex}`
        )
      }
    }
    ctx.drawImage(sprite, Math.round(x), Math.round(y))
  }

  renderStatic = entity => {
    let { x, y } = entity.getComponent(Position)
    const { centered, sprite, w, h } = entity.getComponent(Static)

    if (process.env.NODE_ENV === 'development') {
      if (sprite == null) {
        console.warn(`Got null sprite trying to draw ${entity.name}`)
      }
    }

    if (centered) {
      x -= Math.floor(sprite.width / 2)
      y -= Math.floor(sprite.height / 2)
    }

    // Image should be scaled to this width & height
    if (w && h) {
      ctx.drawImage(sprite, Math.round(x), Math.round(y), w, h)
    } else {
      ctx.drawImage(sprite, Math.round(x), Math.round(y))
    }
  }

  renderBoundingBoxes = entity => {
    const pos = entity.getComponent(Position)
    const bb = entity.getComponent(BoundingBox)
    const colliding = entity.hasComponent(Colliding)
    if (colliding) {
      ctx.strokeStyle = 'red'
    } else {
      ctx.strokeStyle = 'green'
    }
    ctx.beginPath()
    ctx.rect(pos.x + bb.x, pos.y + bb.y, bb.w, bb.h)
    ctx.stroke()
  }

  execute(dt) {
    ctx.clearRect(0, 0, 600, 600)
    this.queries.static.results.forEach(this.renderStatic)
    this.queries.animated.results.forEach(this.renderAnimated(dt))

    this.queries.bb.results.forEach(this.renderBoundingBoxes)
  }
}

export default Renderer
