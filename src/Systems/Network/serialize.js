const serializers = {
  Position: position  => ({ position: { x: position.x, y: position.y }})
}

const serialize = entity => {
  const components = entity.getComponents()
  const values = Object
    .entries(components)
    .filter(([name, value]) => typeof serializers[name] === 'function')
    .map(([name, value]) => serializers[name](value))
    .reduce((acc, item) => ({ ...acc, ...item }), {})
  
  values.id = entity.id

  return values
}

export default serialize