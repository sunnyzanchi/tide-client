import { Component } from 'ecsy'

class Health extends Component {
  max = 0
  value = 0

  reset() {
    this.max = 0
    this.value = 0
  }
}

export default Health