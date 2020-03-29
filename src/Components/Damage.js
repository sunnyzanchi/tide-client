import { Component } from 'ecsy'

class Damage extends Component {
  hp = 0
  
  reset() {
    this.hp = 0
  }
}

export default Damage