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
    const crosshair = this.queries.crosshair.results[0]
    const mc = crosshair.getComponent(MouseControlled)
    const pos = crosshair.getMutableComponent(Position)

    pos.x = mc.x
    pos.y = mc.y    
  }
}

export default Crosshair
