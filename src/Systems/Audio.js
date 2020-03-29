import { System } from 'ecsy'
import { Sound } from '../Components'
import { sounds } from '../sounds'

const ctx = new AudioContext()

class Audio extends System {
  static queries = {
    audio: {
      components: [Sound],
      listen: {
        added: true
      }
    }
  }

  playAudio(entity) {
    const sound = entity.getComponent(Sound)
    const source = ctx.createBufferSource()
    source.buffer = sound.audio

    source.connect(ctx.destination)
    source.start(0)
  }

  execute() {
    for (const entity of this.queries.audio.added) {
      this.playAudio(entity)
    }
  }
}

export default Audio