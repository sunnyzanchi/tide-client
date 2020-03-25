import { Player, Position, Projectile, Velocity } from '../../Components'

const serialzeProjectile = entity => {
  const pos = entity.getComponent(Position)
  const vel = entity.getComponent(Velocity)
 
  return {
    projectileType: 'PROJECTILE0',
    origin: {
      xy: [pos.x, pos.y]
    },
    vel: [vel.x, vel.y],
    type: 'PROJECTILE_CREATED'
  }
}

const serializePlayer = entity => {
 const pos = entity.getComponent(Position)
 const vel = entity.getComponent(Velocity)

 return {
   origin: {
     xy: [pos.x, pos.y],
   },
   vel: [vel.x, vel.y],
   type: 'POSITION_UPDATE'
 }
}

const serialize = entity => {
  const components = entity.getComponentTypes()

  if (components.some(c => c === Player)) {
    return serializePlayer(entity)
  }

  if (components.some(c => c === Projectile)) {
    return serialzeProjectile(entity)
  }
}

export default serialize
