import { Component } from "ecsy";

class Position extends Component {
  x = 20
  y = 20

  reset() {
    this.x = NaN
    this.y = NaN
  }
}

export default Position