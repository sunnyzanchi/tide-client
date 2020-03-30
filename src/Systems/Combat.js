import { System } from 'ecsy'
import {
  Attack,
  Colliding,
  Damage,
  Enemy,
  Health,
  Projectile,
  Sound
} from '../Components'
import { sounds } from '../sounds'

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

    // If the projectile is somewhat far away from the collision,
    // we'll skip over it and handle it next tick
    if (colliding.entryTime > 0.2) return

    let toPlay = sounds.get('impactWall')
    for (const collision of colliding.with) {
      collision.entity.addComponent(Damage, attack)
      if (collision.entity.hasComponent(Enemy)) {
        toPlay = sounds.get('impactEnemy')
      }
    }

    if (entity.hasComponent(Sound)) {
      const sound = entity.getMutableComponent(Sound)
      sound.sound = toPlay
    } else {
      entity.addComponent(Sound, { sound: toPlay })
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
