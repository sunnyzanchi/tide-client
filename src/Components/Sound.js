import { Component } from 'ecsy'

class Sound extends Component {
  audio = null
  loop = false

  reset() {
    audio = null
    loop = false
  }
}

export default Sound