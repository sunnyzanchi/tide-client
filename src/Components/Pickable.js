import { Component } from 'ecsy'

class Pickable extends Component {
  // Sound to be played when the item is picked up
  pickupSound = null

  reset() {
    pickupSound
  }
}

export default Pickable