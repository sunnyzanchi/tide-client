import { Component } from "ecsy";

class Animated extends Component {
  dt = 0
  fps = 24
  frame = 0
  // order of indices to use for animations
  frameIndices = []
  sprites = []

  reset() {
    this.dt = 0
    this.fps = 24
    this.frame = 0
    this.frameIndices = []
    this.sprites = []
  }
}

export default Animated