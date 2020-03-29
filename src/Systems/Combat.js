import { System } from 'ecsy'
import { Colliding, Damage, Health, Projectile } from '../Components'

class Combat extends System {
  static queries = {
    gettingDamaged: {
      components: [Damage]
    },
    projectiles: {
      components: [Colliding, Projectile]
    }
  }

  handleDamage(entity) {
    if (!entity.hasComponent(Health)) {
      entity.removeComponent(Damage)
      return
    }
    const { hp } = entity.getComponent(Damage)
  }

  handleProjectiles(entity) {
    const attack = entity.getComponent(Attack)
    const colliding = entity.getComponent(Colliding)

    for (const other of colliding.with) {
      other.addComponent(Damage, attack)
    }

    entity.remove()
  }

  execute() {
    for (const entity of this.queries.projectiles.results) {
      this.handleProjectiles(entity)
    }
    
    for (const entity of this.queries.gettingDamaged.results) {
      this.handleDamage(entity)
    }
  }
}

export default Combat