import { System } from 'ecsy'

import {
  KeyControlled,
  MouseControlled,
  Position,
} from '../Components'
import { sprites } from '../sprites'

class Controls extends System {
  static queries = {
    keyControlled: {
      components: [KeyControlled]
    },
    mouseControlled: {
      components: [MouseControlled]
    }
  }

  bulletLimiter = 0

  keys = new Set()

  mouse = {
    buttons: 0,
    x: 0,
    y: 0
  }

  keyDown = e => {
    const key = e.key

    this.keys.add(key)
  }

  keyUp = e => {
    const key = e.key

    this.keys.delete(key)
  }

  mouseMove = e => {
    this.mouse.x = e.clientX
    this.mouse.y = e.clientY
  }

  mouseDown = e => {
    this.mouse.buttons = e.buttons
  }

  mouseUp = e => {
    this.mouse.buttons = 0
  }

  init() {
    document.addEventListener('keydown', this.keyDown)
    document.addEventListener('keyup', this.keyUp)
    document.addEventListener('mousemove', this.mouseMove)
    document.addEventListener('mousedown', this.mouseDown)
    document.addEventListener('mouseup', this.mouseUp)
  }

  updateKeys(entity) {
    const kc = entity.getMutableComponent(KeyControlled)
    // Not sure if we need to copy this.keys into a new set yet
    kc.keys = this.keys
  }

  updateMouse(entity) {
    const mc = entity.getMutableComponent(MouseControlled)

    mc.x = this.mouse.x
    mc.y = this.mouse.y

    // MouseEvent#buttons is a bit field
    // 0001 is LMB, 0010 is RMB, 0100 is MMB, etc
    // See https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons
    mc.LMB = Boolean(this.mouse.buttons & 0b001)
    mc.RMB = Boolean(this.mouse.buttons & 0b010)
    mc.MMB = Boolean(this.mouse.buttons & 0b100)
  }

  execute(dt) {
    for (const entity of this.queries.keyControlled.results) {
      this.updateKeys(entity)
    }

    for (const entity of this.queries.mouseControlled.results) {
      this.updateMouse(entity)
    }
  }
}

export default Controls
