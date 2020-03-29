import { Component } from 'ecsy'

class BoundingBox extends Component {
  // Offset from position
  // Say the entity's position is 0, 0
  // Its bounding box may not start at 0, 0,
  // and it might not take up its whole width and height
  x = 0
  y = 0
  w = 0
  h = 0

  reset() {
    this.w = 0
    this.h = 0
  }
}

export default BoundingBox