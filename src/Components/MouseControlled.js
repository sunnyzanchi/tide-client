import { Component } from 'ecsy'

class MouseControlled extends Component {
  LMB = false
  RMB = false
  MMB = false
  x = 0
  y = 0

  reset() {
    this.LMB = false
    this.RMB = false
    this.MMB = false
    x = 0
    y = 0
  }
}

export default MouseControlled