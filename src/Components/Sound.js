import { Component } from 'ecsy'

class Sound extends Component {
  sound = null
  loop = false

  reset() {
    this.sound = null
    this.loop = false
  }
}

export default Sound