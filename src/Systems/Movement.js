import { System, Not } from 'ecsy'
import Vector from 'victor'
import {
  Bounce,
  BoundingBox,
  Colliding,
  Mass,
  Position,
  Velocity
} from '../Components'

const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t

class Movement extends System {
  static queries = {
    colliding: {
      components: [Position, Velocity, Colliding]
    },
    moving: {
      components: [Position, Velocity, Not(Colliding)]
    }
  }

  // Bounce off the intersecting face
  bounceResponse = dt => entity => {
    const colliding = entity.getComponent(Colliding)
    const pos = entity.getMutableComponent(Position)
    const vel = entity.getMutableComponent(Velocity)

    for (const other of colliding.with) {
      const remaining = 1 - other.intersection.entryTime
      const normalx = other.intersection.normalx
      const normaly = other.intersection.normaly

      vel.x *= remaining
      vel.y *= remaining
      if (Math.abs(normalx) > 0.0001) {
        vel.x = -vel.x
      }
      if (Math.abs(normaly) > 0.0001) {
        vel.y = -vel.y
      }
    }

    pos.x += vel.x * (dt / 1000)
    pos.y += vel.y * (dt / 1000)
  }

  // Slide along the intersecting face
  slideResponse = dt => entity => {
    const colliding = entity.getComponent(Colliding)
    const pos = entity.getMutableComponent(Position)
    const vel = entity.getMutableComponent(Velocity)

    for (const other of colliding.with) {
      const remaining = 1 - other.intersection.entryTime
      const normalx = other.intersection.normalx
      const normaly = other.intersection.normaly
      const dotproduct = (vel.x * normaly + vel.y * normalx) * remaining

      vel.x = dotproduct * normaly
      vel.y = dotproduct * normalx
    }

    pos.x += vel.x * (dt / 1000)
    pos.y += vel.y * (dt / 1000)
  }

  execute(dt) {
    this.queries.moving.results.forEach(entity => {
      const pos = entity.getMutableComponent(Position)
      const vel = entity.getComponent(Velocity)
      pos.x += vel.x * (dt / 1000)
      pos.y += vel.y * (dt / 1000)
    })

    this.queries.colliding.results.forEach(entity => {
      if (entity.hasComponent(Bounce)) {
        this.bounceResponse(dt)(entity)
      } else {
        this.slideResponse(dt)(entity)
      }
    })
  }
}

export default Movement
