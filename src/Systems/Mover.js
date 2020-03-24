import { System } from 'ecsy'
import { Position, Velocity } from '../Components'

class Mover extends System {
  static queries = {
    moving: {
      components: [Position, Velocity]
    }
  }

  execute(dt) {
    this.queries.moving.results.forEach(entity => {
      const { x: vx, y: vy } = entity.getComponent(Velocity)
      const p = entity.getMutableComponent(Position)

      p.x += vx / dt
      p.y += vy / dt
    })

  }
}

export default Mover