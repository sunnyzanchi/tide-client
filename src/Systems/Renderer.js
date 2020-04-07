import { System } from 'ecsy'
import {
  Animated,
  BoundingBox,
  Colliding,
  Damage,
  Enemy,
  Health,
  Movable,
  Position,
  Static
} from '../Components'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
ctx.imageSmoothingEnabled = false
ctx.strokeStyle = 'limegreen'
ctx.lineWidth = '1px'

const getCurrentSprite = entity => {
  if (entity.hasComponent(Animated)) {
    const a = entity.getComponent(Animated)
    return a.sprites[a.frameIndex]
  }

  if (entity.hasComponent(Static)) {
    return entity.getComponent(Static).sprite
  }
}

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
    },
    health: {
      components: [Health]
    },
    gettingDamaged: {
      components: [Damage, Enemy],
      listen: {
        removed: true
      }
    }
  }

  damageFlashes = new Set()

  renderAnimated(entity, dt) {
    const { x, y } = entity.getComponent(Position)
    const a = entity.getMutableComponent(Animated)

    const sprite = a.sprites[a.frameIndex]

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

  renderStatic(entity) {
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

  renderBoundingBox(entity) {
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

  renderHealthBar(entity) {
    const { x, y } = entity.getComponent(Position)
    const { max, value } = entity.getComponent(Health)
    const sprite = getCurrentSprite(entity)
    const width = sprite.width
    const perc = value / max

    ctx.beginPath()
    ctx.fillStyle = 'red'
    ctx.fillRect(x, y - 10, width, 3)

    ctx.beginPath()
    ctx.fillStyle = 'limegreen'
    ctx.fillRect(x, y - 10, width * perc, 3)
  }

  renderDamageFlash(entity, frame) {
    const {x, y} = entity.getComponent(Position)
    const sprite = getCurrentSprite(entity)
    const width = sprite.width
    const height = sprite.height
    const alpha = 1 / (frame + 1)

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
    ctx.beginPath()
    ctx.fillRect(x, y, width, height)
  }

  execute(dt) {
    ctx.clearRect(0, 0, 600, 600)
    ctx.globalCompositeOperation = 'source-over'
    for (const entity of this.queries.static.results) {
      this.renderStatic(entity)
    }

    for (const entity of this.queries.animated.results) {
      this.renderAnimated(entity, dt)
    }

    for (const entity of this.queries.bb.results) {
      this.renderBoundingBox(entity)
    }

    for (const entity of this.queries.health.results) {
      this.renderHealthBar(entity)
    }

    ctx.globalCompositeOperation = 'source-atop'
    for (const entity of this.queries.gettingDamaged.removed) {
      this.damageFlashes.add({ entity, frame: 0 })
    }

    for (const item of this.damageFlashes) {
      if (item.frame === 3) {
        this.damageFlashes.delete(item)
        return
      }

      this.renderDamageFlash(item.entity, item.frame)
      item.frame += 1
    }
  }
}

export default Renderer
