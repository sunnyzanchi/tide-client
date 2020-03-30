import drawKnifeOgg from '../assets/audio/drawKnife2.ogg'
import impactEnemyOgg from '../assets/audio/impactMining_002.ogg'
import impactWallOgg from '../assets/audio/footstep_carpet_000.ogg'
import shotOgg from '../assets/audio/footstep_concrete_001.ogg'

const ctx = new OfflineAudioContext({
  numberOfChannels: 2,
  length: 44100 * 5,
  sampleRate: 44100
})

class SoundManager {
  sounds = {}

  /**
   * Add a sound at key `name`
   * @param {String} name
   * @param {AudioBuffer} sound
   */
  add(name, sound) {
    if (process.env.NODE_ENV === 'development') {
      if (this.sounds[name] != undefined) {
        console.warn(`Key ${name} is alread set, overriding`)
      }
    }

    this.sounds[name] = sound
    return this
  }

  /**
   * Returns the sound at key `name`
   * @param {String} name
   * @returns {AudioBuffer}
   */
  get(name) {
    return this.sounds[name]
  }
}

export const sounds = new SoundManager()

const loadSound = url =>
  fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => ctx.decodeAudioData(buf))

const urls = [drawKnifeOgg, impactEnemyOgg, impactWallOgg, shotOgg]

export const loadSounds = () =>
  Promise.all(urls.map(loadSound)).then(
    ([drawKnife, impactEnemy, impactWall, shot]) => {
      sounds.add('drawKnife', drawKnife)
      sounds.add('impactEnemy', impactEnemy)
      sounds.add('impactWall', impactWall)
      sounds.add('shot', shot)
    }
  )
