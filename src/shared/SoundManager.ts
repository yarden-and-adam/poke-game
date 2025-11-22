interface SoundEffect {
  name: string
  file: string
  volume?: number
}

class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map()
  private enabled: boolean = true
  private volume: number = 0.5

  constructor() {
    this.loadSounds()
  }

  private loadSounds() {
    const soundEffects: SoundEffect[] = [
      { name: 'hit', file: 'sounds/hit.mp3', volume: 0.6 },
      { name: 'critical', file: 'sounds/critical.mp3', volume: 0.8 },
      { name: 'ko', file: 'sounds/ko.mp3', volume: 0.7 },
      { name: 'super-move', file: 'sounds/super-move.mp3', volume: 0.9 },
      { name: 'heal', file: 'sounds/heal.mp3', volume: 0.5 },
      { name: 'switch', file: 'sounds/switch.mp3', volume: 0.4 },
      { name: 'victory', file: 'sounds/victory.mp3', volume: 0.8 },
      { name: 'select', file: 'sounds/select.mp3', volume: 0.3 },
      { name: 'type-effective', file: 'sounds/super-effective.mp3', volume: 0.7 },
      { name: 'type-weak', file: 'sounds/not-very-effective.mp3', volume: 0.4 }
    ]

    soundEffects.forEach(effect => {
      try {
        const audio = new Audio(effect.file)
        audio.volume = (effect.volume || 0.5) * this.volume
        this.sounds.set(effect.name, audio)
      } catch (error) {
        console.log(`Could not load sound: ${effect.name}`, error)
      }
    })
  }

  play(soundName: string) {
    if (!this.enabled) return
    
    const sound = this.sounds.get(soundName)
    if (sound) {
      try {
        sound.currentTime = 0
        sound.play().catch(() => {
          // Ignore autoplay errors - common in browsers
        })
      } catch (error) {
        console.log(`Could not play sound: ${soundName}`, error)
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume))
    this.sounds.forEach(sound => {
      sound.volume = (sound.volume || 0.5) * this.volume
    })
  }

  // Create simple sound files using Web Audio API for fallback
  createSimpleSound(frequency: number, duration: number, type: OscillatorType = 'sine'): HTMLAudioElement {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
      
      // Return a dummy audio element for consistency
      const dummyAudio = new Audio()
      return dummyAudio
    } catch (error) {
      console.log('Web Audio API not available:', error)
      return new Audio()
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager()
export default soundManager
