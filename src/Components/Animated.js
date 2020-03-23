import { Component } from "ecsy";

class Animated extends Component {
  dt = 0
  frame = 0
  fps = 24
  // Sprites go into a map like:
  // {
  //   WALKING_RIGHT: {
  //     // frames is the order of indices to use for animations
  //     frames: [0, 1, 2, 3],
  //     sprites: [BitmapImage, ...],
  //   }
  // }
  sprites = {}
}

export default Animated