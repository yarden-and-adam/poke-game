import React, { useEffect, useState } from 'react'

interface PowerUpEffectProps {
  visible: boolean
  type: 'lightning' | 'fire' | 'water' | 'grass' | 'electric' | 'psychic' | 'ice' | 'ground' | 'flying' | 'bug' | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy' | 'fighting' | 'poison' | 'normal'
  position: { x: number, y: number }
  onComplete?: () => void
}

export default function PowerUpEffect({ visible, type, position, onComplete }: PowerUpEffectProps) {
  const [effectPhase, setEffectPhase] = useState(0)

  useEffect(() => {
    if (visible) {
      setEffectPhase(0)
      const timer1 = setTimeout(() => setEffectPhase(1), 100)
      const timer2 = setTimeout(() => setEffectPhase(2), 400)
      const timer3 = setTimeout(() => setEffectPhase(3), 800)
      const timer4 = setTimeout(() => {
        setEffectPhase(4)
        onComplete?.()
      }, 1200)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }
  }, [visible, onComplete])

  if (!visible) return null

  const getEffectEmoji = () => {
    switch (type) {
      case 'lightning':
      case 'electric':
        return '⚡'
      case 'fire':
        return '🔥'
      case 'water':
        return '💧'
      case 'grass':
        return '🌿'
      case 'psychic':
        return '🔮'
      case 'ice':
        return '❄️'
      case 'ground':
        return '🪨'
      case 'flying':
        return '🌪️'
      case 'bug':
        return '🐛'
      case 'rock':
        return '🪨'
      case 'ghost':
        return '👻'
      case 'dragon':
        return '🐉'
      case 'dark':
        return '🌑'
      case 'steel':
        return '⚙️'
      case 'fairy':
        return '🧚'
      case 'fighting':
        return '🥊'
      case 'poison':
        return '☠️'
      case 'normal':
        return '✨'
      default:
        return '✨'
    }
  }

  const getEffectAnimation = () => {
    switch (effectPhase) {
      case 0:
        return 'power-up-appear'
      case 1:
        return 'power-up-pulse'
      case 2:
        return 'power-up-burst'
      case 3:
        return 'power-up-spiral'
      case 4:
        return 'power-up-fade'
      default:
        return ''
    }
  }

  const getEffectColor = () => {
    switch (type) {
      case 'lightning':
      case 'electric':
        return '#FFD700'
      case 'fire':
        return '#FF6B35'
      case 'water':
        return '#4FC3F7'
      case 'grass':
        return '#66BB6A'
      case 'psychic':
        return '#BA68C8'
      case 'ice':
        return '#B3E5FC'
      case 'ground':
        return '#8D6E63'
      case 'flying':
        return '#90CAF9'
      case 'bug':
        return '#9CCC65'
      case 'rock':
        return '#A1887F'
      case 'ghost':
        return '#CE93D8'
      case 'dragon':
        return '#FF7043'
      case 'dark':
        return '#5D4037'
      case 'steel':
        return '#B0BEC5'
      case 'fairy':
        return '#F8BBD0'
      case 'fighting':
        return '#EF5350'
      case 'poison':
        return '#AB47BC'
      case 'normal':
        return '#E0E0E0'
      default:
        return '#E0E0E0'
    }
  }

  return (
    <div 
      className="power-up-effect"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 1000
      }}
    >
      <div className={`power-up-content ${getEffectAnimation()}`}>
        <div 
          className="power-up-aura"
          style={{
            backgroundColor: getEffectColor(),
            boxShadow: `0 0 30px ${getEffectColor()}`,
          }}
        />
        <div className="power-up-emoji">
          {getEffectEmoji()}
        </div>
        
        {/* Particle effects */}
        <div className="power-up-particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                backgroundColor: getEffectColor(),
                animationDelay: `${i * 0.1}s`,
                transform: `rotate(${i * 60}deg) translateX(20px)`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}