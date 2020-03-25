import { Component } from 'ecsy'

class KeyControlled extends Component {
  keys = new Set()

  reset() {
    this.keys = new Set()
  }
}

export default KeyControlled
