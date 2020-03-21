import { System } from 'ecsy'
import { Position, Renderable } from '../Components'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Renderer extends System {
  static queries = {
    renderable: {
      components: [Position, Renderable]
    }
  }

  execute() {
    ctx.clearRect(0, 0, 600, 600)
    this.queries.renderable.results.forEach(entity => {
      const { x, y } = entity.getComponent(Position)

      ctx.beginPath()
      ctx.ellipse(x, y, 10, 10, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.closePath()
    })
  }
}

export default Renderer
