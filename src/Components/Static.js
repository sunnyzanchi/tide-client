import { Component } from 'ecsy'

class Static extends Component {
  // Render sprite with center at its xy position instead of top left
  centered = false
  sprite = null
  w = null
  h = null

  reset() {
    this.centered = false
    this.sprite = null
    this.w = null
    this.h = null
  }
}

export default Static
