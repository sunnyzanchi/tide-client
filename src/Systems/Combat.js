import { System } from 'ecsy'
import { Attack, Colliding, Damage, Health, Projectile } from '../Components'

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
    const health = entity.getMutableComponent(Health)

    health.value -= hp
    entity.removeComponent(Damage)
  }

  handleProjectiles(entity) {
    const attack = entity.getComponent(Attack)
    const colliding = entity.getComponent(Colliding)

    for (const collision of colliding.with) {
      collision.entity.addComponent(Damage, attack)
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