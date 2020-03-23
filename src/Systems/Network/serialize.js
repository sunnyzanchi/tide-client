import { Position } from '../../Components'

const serializers = {
  Position: position  => ({ position: { x: position.x, y: position.y }})
}

const serialize = entity => {
  const position = entity.getComponent(Position)
  
  const result = {
    xy: [position.x, position.y],
    type: 'POSITION_UPDATE',
    name: entity.name
  }

  return result
}

export default serialize
