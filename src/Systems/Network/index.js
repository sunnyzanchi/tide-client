import { System } from 'ecsy'
import Sockette from 'sockette'

import serialize from './serialize'
import { Networked } from '../../Components'

const ADDRESS = 'ws://127.0.0.1:1234'
// const ADDRESS = 'ws://demos.kaazing.com/echo'

class Network extends System {
  static queries = {
    networked: {
      components: [Networked],
      listen: {
        changed: true
      }
    }
  }

  limiter = 0

  handleMessage = e => {
    // const data = JSON.parse(e.data)
    // const entites = data.entities

    // entites.forEach(entity => {
    //   this.world.createEntity()
    // })
    console.log('recieved message', e.data)
  }

  init() {
    const self = this
    const socket = new Sockette(ADDRESS, {
      maxAttempts: 0,
      onopen: e => (self.socket = socket),
      onmessage: this.handleMessage,
      onreconnect: e => (self.socket = socket),
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => (self.socket = null),
      onerror: e => (self.socket = null)
    })
  }

  execute(delta, time) {
    this.limiter += delta

    if (this.limiter < 2000) return

    this.limiter = 0
    this.queries.networked.results.forEach(entity => {
      const serialized = serialize(entity)
      serialized.timestamp = time
      this.socket && this.socket.json(serialized)
    })
  }
}

export default Network
