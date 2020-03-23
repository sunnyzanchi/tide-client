import { System } from 'ecsy'
import { Animated, Movable, Position, Renderable } from '../Components'

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

class Renderer extends System {
  static queries = {
    renderable: {
      components: [Position, Renderable]
    }
  }

  getAnimation(entity) {
    const { direction } = entity.getComponent(Movable)
    const animation = {
      frame: 0,
      name: null,
      play: true,
    }

    if (direction === 'up') animation.name = 'WALKING_UP'
    if (direction === 'down') animation.name = 'WALKING_DOWN'
    if (direction === 'left') animation.name = 'WALKING_LEFT'
    if (direction === 'right') animation.name = 'WALKING_RIGHT'
    if (direction === 'none') {
      animation.name ='WALKING_DOWN'
      animation.play = false
    }

    return animation
  }

  execute(dt) {
    ctx.clearRect(0, 0, 600, 600)
    this.queries.renderable.results.forEach(entity => {
      const { x, y } = entity.getComponent(Position)
      const r = entity.getComponent(Renderable)
      const animated = entity.hasComponent(Animated)

      let sprite;
      
      if (animated) {
        const a = entity.getMutableComponent(Animated)
        const { frame: staticFrame, name, play } = this.getAnimation(entity)

        const frameIndex = play ? a.frame : staticFrame
        const frame = a.sprites[name].frames[frameIndex]

        sprite = a.sprites[name].sprites[frame]

        a.dt += dt
        if (a.dt > 1000 / a.fps) {
          a.dt = 0
          a.frame += 1
        }

        if (a.frame > a.sprites[name].frames.length - 1) {
          a.frame = 0
        }
      } else {
        sprite = r.sprite
      }

      ctx.drawImage(sprite, x, y)
    })
  }
}

export default Renderer
