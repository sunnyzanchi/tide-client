import { System } from 'ecsy'
import { Sound } from '../Components'
import { sounds } from '../sounds'

const ctx = new AudioContext()

class Audio extends System {
  static queries = {
    audio: {
      components: [Sound],
      listen: {
        added: true,
        changed: true
      }
    }
  }

  playAudio(entity) {
    // May need to restructure some stuff - 
    // in the Combat system, the projectile is removed when a collision is detected
    // But, the projectile could potentially be created and deleted in the same tick
    // For now, I'm trying to get the Sound component falling back to it if it's removed
    const sound = entity.getComponent(Sound) || entity.getRemovedComponent(Sound)
    const source = ctx.createBufferSource()
    source.buffer = sound.sound

    source.connect(ctx.destination)
    source.start(0)
  }

  execute() {
    for (const entity of this.queries.audio.added) {
      this.playAudio(entity)
    }
    for (const entity of this.queries.audio.changed) {
      this.playAudio(entity)
    }
  }
}

export default Audio