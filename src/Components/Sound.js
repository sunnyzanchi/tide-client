import { Component } from 'ecsy'

class Sound extends Component {
  audio = null
  loop = false

  reset() {
    this.audio = null
    this.loop = false
  }
}

export default Sound