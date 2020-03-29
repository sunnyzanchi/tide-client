import { System } from 'ecsy'
import Sockette from 'sockette'

import serialize from './serialize'
import { Networked, Player, Projectile } from '../../Components'

const ADDRESS = 'ws://127.0.0.1:1234'
// const ADDRESS = 'ws://demos.kaazing.com/echo'

class Network extends System {
  static queries = {
    projectiles: {
      components: [Networked, Projectile],
      listen: {
        added: true
      }
    },
    player: {
      components: [Networked, Player],
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
      onreconnect: e => {
        if (e.type === 'close') return

        self.socket = socket
      },
      onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => (self.socket = null),
      onerror: e => (self.socket = null)
    })
  }

  sendUpdate(entity, time) {
    const serialized = serialize(entity)
    serialized.origin.timeMs = Math.floor(time)
    this.socket && this.socket.json(serialized)
  }

  execute(delta, time) {
    this.limiter += delta

    for (let entity of this.queries.projectiles.added) {
      this.sendUpdate(entity, time)
    }

    if (this.limiter < 1000) return

    this.limiter = 0
    for (let entity of this.queries.player.results) {
      this.sendUpdate(entity, time)
    }
  }
}

export default Network
