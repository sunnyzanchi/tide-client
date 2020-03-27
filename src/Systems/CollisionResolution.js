import { System } from 'ecsy'
import { BoundingBox, Colliding, Position, Velocity } from '../Components'
import { intersects } from './Collision'

const xCausesCollision = (x1, y1, bb1, x2, y2, bb2, vel) => {
  const hasCollision = intersects(x1, y1, bb1, x2, y2, bb2)
  const hadCollision = intersects(x1 - bb1.w * Math.sign(vel), y1, bb1, x2, y2, bb2)

  return hasCollision && !hadCollision
}

const yCausesCollision = (x1, y1, bb1, x2, y2, bb2, vel) => {
  const hasCollision = intersects(x1, y1, bb1, x2, y2, bb2)
  const hadCollision = intersects(x1, y1 - bb1.h * Math.sign(vel), bb1, x2, y2, bb2)

  return hasCollision && !hadCollision
}

class CollisionResolution extends System {
  static queries = {
    colliding: {
      components: [Position, Velocity, Colliding]
    }
  }

  execute(dt, time) {
    this.queries.colliding.results.forEach(entity => {
      const bb = entity.getComponent(BoundingBox)
      const pos = entity.getMutableComponent(Position)
      const vel = entity.getMutableComponent(Velocity)
      const colliding = entity.getComponent(Colliding)

      const other = colliding.with[0]

      // for (const other of colliding.with) {
        const obb = other.getComponent(BoundingBox)
        const opos = other.getComponent(Position)

        while (xCausesCollision(pos.x, pos.y, bb, opos.x, opos.y, obb, vel.x)) {
          pos.x -= Math.sign(vel.x)

        }

        while (yCausesCollision(pos.x, pos.y, bb, opos.x, opos.y, obb, vel.y)) {
          pos.y -= Math.sign(vel.y)
        }
      // }
    })
  }
}

export default CollisionResolution
