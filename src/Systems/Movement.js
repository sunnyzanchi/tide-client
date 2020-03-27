import { System, Not } from 'ecsy'
import Vector from 'victor'
import { BoundingBox, Colliding, Mass, Position, Velocity } from '../Components'

class Movement extends System {
  static queries = {
    moving: {
      components: [Position, Velocity, Not(Colliding)]
    }
  }

  execute(dt) {
    this.queries.moving.results.forEach(entity => {
      const pos = entity.getMutableComponent(Position)
      const vel = entity.getMutableComponent(Velocity)
      pos.x += vel.x * (dt / 1000)
      pos.y += vel.y * (dt / 1000)
    })
  }
}

export default Movement
