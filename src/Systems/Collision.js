import { System } from 'ecsy'
import {
  BoundingBox,
  Colliding,
  Player,
  Position,
  Projectile
} from '../Components'

/**
 * Given two x,y coords and two bounding boxes, see if they collide
 * @param {Number} x1
 * @param {Number} y1
 * @param {BoundingBox} bb1
 * @param {Number} x2
 * @param {Number} y2
 * @param {BoundingBox} bb2
 * @returns {Boolean}
 */
export const intersects = (x1, y1, bb1, x2, y2, bb2) => {
  const bbx1 = x1 + bb1.x
  const bby1 = y1 + bb1.y
  const bbx2 = x2 + bb2.x
  const bby2 = y2 + bb2.y

  return (
    bbx1 < bbx2 + bb2.w &&
    bbx1 + bb1.w > bbx2 &&
    bby1 < bby2 + bb2.h &&
    bby1 + bb1.h > bby2
  )
}

class Collision extends System {
  static queries = {
    colliders: {
      components: [BoundingBox, Position]
    }
  }

  execute() {
    this.queries.colliders.results.forEach(entity => {
      const pos1 = entity.getComponent(Position)
      const bb1 = entity.getComponent(BoundingBox)

      const collisions = []

      this.queries.colliders.results.forEach(other => {
        // Can't collide against yourself
        if (entity === other) return
        if (
          (entity.hasComponent(Player) && other.hasComponent(Projectile)) ||
          (entity.hasComponent(Projectile) && other.hasComponent(Player))
        )
          return

        const pos2 = other.getComponent(Position)
        const bb2 = other.getComponent(BoundingBox)

        if (intersects(pos1.x, pos1.y, bb1, pos2.x, pos2.y, bb2)) {
          collisions.push(other)
        }
      })

      if (collisions.length > 0) {
        entity.addComponent(Colliding, { with: collisions })
      } else {
        entity.removeComponent(Colliding)
      }
    })
  }
}

export default Collision
