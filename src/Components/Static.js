import { Component } from 'ecsy'

class Static extends Component {
  // Render sprite with center at its xy position instead of top left
  centered = false
  sprite = null

  reset() {
    this.centered = false
    this.sprite = null
  }
}

export default Static
