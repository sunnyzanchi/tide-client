import { System } from 'ecsy'

import {
  Crosshair as CrosshairComponent,
  MouseControlled,
  Position
} from '../Components'

class Crosshair extends System {
  static queries = {
    crosshair: {
      components: [CrosshairComponent]
    }
  }

  execute() {
    this.queries.crosshair.results.forEach(entity => {
      const mc = entity.getComponent(MouseControlled)
      const pos = entity.getMutableComponent(Position)

      pos.x = mc.x
      pos.y = mc.y
    })
  }
}

export default Crosshair
