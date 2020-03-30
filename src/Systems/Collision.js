import { System } from 'ecsy'
import {
  BoundingBox,
  Colliding,
  Player,
  Position,
  Projectile,
  Velocity
} from '../Components'

const zeroVel = { x: 0, y: 0 }
const noCollision = {
  normalx: 0,
  normaly: 0,
  entryTime: 1
}

/**
 * Use swept collision detection to get the time at which bb1 will intersect bb2
 * https://www.gamedev.net/articles/programming/general-and-gameplay-programming/swept-aabb-collision-detection-and-response-r3084/
 * Someone in the comments pointed out a couple bugs with the posted solution
 * Probs saved me from shooting myself
 * @param {Number} x1
 * @param {Number} y1
 * @param {BoundingBox} bb1
 * @param {Number} x2
 * @param {Number} y2
 * @param {BoundingBox} bb2
 * @param {Number} vel
 */
const swept = (x1, y1, bb1, x2, y2, bb2, vel) => {
  // BoundingBox#x and y are relative offsets,
  // its true x, y is the entity's position.x,y + bb.x,y
  const bb1x = x1 + bb1.x
  const bb1y = y1 + bb1.y
  const bb2x = x2 + bb2.x
  const bb2y = y2 + bb2.y

  let xInvEntry
  let yInvEntry
  let xInvExit
  let yInvExit

  // find the distance between the objects on the near and far sides for both x and y
  if (vel.x > 0) {
    xInvEntry = bb2x - (bb1x + bb1.w)
    xInvExit = bb2x + bb2.w - bb1x
  } else {
    xInvEntry = bb2x + bb2.w - bb1x
    xInvExit = bb2x - (bb1x + bb1.w)
  }

  if (vel.y > 0) {
    yInvEntry = bb2y - (bb1y + bb1.h)
    yInvExit = bb2y + bb2.h - bb1y
  } else {
    yInvEntry = bb2y + bb2.h - bb1y
    yInvExit = bb2y - (bb1y + bb1.h)
  }

  // Times for entry and exit intersections for each axis
  let xEntry
  let yEntry
  let xExit
  let yExit

  if (vel.x === 0) {
    xEntry = Number.NEGATIVE_INFINITY
    xExit = Number.POSITIVE_INFINITY
  } else {
    xEntry = xInvEntry / vel.x
    xExit = xInvExit / vel.x
  }

  if (vel.y === 0) {
    yEntry = Number.NEGATIVE_INFINITY
    yExit = Number.POSITIVE_INFINITY
  } else {
    yEntry = yInvEntry / vel.y
    yExit = yInvExit / vel.y
  }

  if (yEntry > 1) {
    yEntry = Number.NEGATIVE_INFINITY
  }
  if (xEntry > 1) {
    xEntry = Number.NEGATIVE_INFINITY
  }
  const entryTime = Math.max(xEntry, yEntry)
  const exitTime = Math.min(xExit, yExit)

  if (entryTime > exitTime) return noCollision
  if (xEntry < 0 && yEntry < 0) return noCollision
  if (xEntry < 0) {
    // Check that the bounding box started overlapped or not.
    if (bb1x + bb1.w < bb2x || bb1x > bb2x + bb2.w) return noCollision
  }
  if (yEntry < 0) {
    // Check that the bounding box started overlapped or not.
    if (bb1y + bb1.h < bb2y || bb1y > bb2y + bb2.h) return noCollision
  }

  let normalx
  let normaly

  // Calculate normal of collided surface
  if (xEntry > yEntry) {
    if (xInvEntry < 0) {
      normalx = 1
      normaly = 0
    } else {
      normalx = -1
      normaly = 0
    }
  } else {
    if (yInvEntry < 0) {
      normalx = 0
      normaly = 1
    } else {
      normalx = 0
      normaly = -1
    }
  }

  // entryTime is time of collision
  return {
    entryTime,
    normalx,
    normaly
  }
}

class Collision extends System {
  static queries = {
    colliders: {
      components: [BoundingBox, Position]
    },
    moving: {
      components: [BoundingBox, Position, Velocity]
    }
  }

  // Potential performance hack:
  // reuse this object rather than creating a new one inside this function
  adjustedVel = {
    x: 0,
    y: 0
  }

  /**
   * Use swept collision detection to detect collision between one moving
   * and one static entity.
   * When it finds a collision/collisions, it adds the Collding component
   * to that entity.
   * The `with` property is a list of entities it's colliding with.
   * @param {Entity} entity
   * @param {Number} dt
   */
  findCollisions = (entity, dt) => {
    const bb1 = entity.getComponent(BoundingBox)
    const pos1 = entity.getComponent(Position)
    const vel = entity.getComponent(Velocity)

    const collisions = []

    for (let other of this.queries.colliders.results) {
      // Can't collide against yourself
      // Projectiles can't collide against other projectiles
      if (entity === other) continue
      if (
        (entity.hasComponent(Player) && other.hasComponent(Projectile)) ||
        (entity.hasComponent(Projectile) && other.hasComponent(Player)) ||
        (entity.hasComponent(Projectile) && other.hasComponent(Projectile))
      )
        continue

      const pos2 = other.getComponent(Position)
      const bb2 = other.getComponent(BoundingBox)

      this.adjustedVel.x = vel.x * (dt/ 1000)
      this.adjustedVel.y = vel.y * (dt/ 1000)
      const intersection = swept(pos1.x, pos1.y, bb1, pos2.x, pos2.y, bb2, this.adjustedVel)

      // No collision
      if (intersection.entryTime === 1) continue

      collisions.push({ entity: other, intersection })
    }

    if (collisions.length > 0) {
      entity.addComponent(Colliding, { with: collisions })
    } else {
      entity.removeComponent(Colliding)
    }
  }

  execute(dt) {
    for (const entity of this.queries.moving.results) {
      this.findCollisions(entity, dt)
    }
  }
}

export default Collision
