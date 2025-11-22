import React, { useEffect, useState } from 'react'

interface CelebrationOverlayProps {
  type: 'critical' | 'ko' | 'super-move' | 'victory'
  visible: boolean
  onComplete?: () => void
}

export default function CelebrationOverlay({ type, visible, onComplete }: CelebrationOverlayProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (visible) {
      setAnimationPhase(0)
      const timer1 = setTimeout(() => setAnimationPhase(1), 200)
      const timer2 = setTimeout(() => setAnimationPhase(2), 600)
      const timer3 = setTimeout(() => {
        setAnimationPhase(3)
        onComplete?.()
      }, 1200)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
      }
    }
  }, [visible, onComplete])

  if (!visible) return null

  const celebrations = {
    critical: {
      emoji: '⭐',
      text: 'CRITICAL HIT!',
      bgColor: 'rgba(255, 215, 0, 0.9)',
      textColor: '#fff',
      particles: ['✨', '⭐', '💫']
    },
    ko: {
      emoji: '💀',
      text: 'KNOCKED OUT!',
      bgColor: 'rgba(255, 107, 107, 0.9)',
      textColor: '#fff',
      particles: ['💥', '⚡', '🌟']
    },
    'super-move': {
      emoji: '🌟',
      text: 'SUPER MOVE!',
      bgColor: 'rgba(147, 51, 234, 0.9)',
      textColor: '#fff',
      particles: ['🌈', '⚡', '🎆', '✨']
    },
    victory: {
      emoji: '🏆',
      text: 'VICTORY!',
      bgColor: 'rgba(16, 185, 129, 0.9)',
      textColor: '#fff',
      particles: ['🎊', '🎉', '🎈', '🌟', '🎆', '✨', '🏅', '👑'],
      specialEffects: ['confetti', 'fireworks', 'stars']
    }
  }

  const celebration = celebrations[type]

  return (
    <div className="celebration-overlay">
      <div className="celebration-backdrop" />
      
      {/* Main celebration content */}
      <div 
        className={`celebration-content celebration-${type}`}
        style={{
          backgroundColor: celebration.bgColor,
          color: celebration.textColor
        }}
      >
        <div className="celebration-emoji">{celebration.emoji}</div>
        <div className="celebration-text">{celebration.text}</div>
      </div>

      {/* Particle effects */}
      <div className="celebration-particles">
        {celebration.particles.map((particle, index) => (
          <div
            key={index}
            className="celebration-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${1 + Math.random() * 1}s`
            }}
          >
            {particle}
          </div>
        ))}
      </div>

      {/* Special victory effects */}
      {type === 'victory' && (
        <>
          {/* Confetti */}
          <div className="victory-confetti">
            {[...Array(30)].map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="confetti-piece"
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700'][Math.floor(Math.random() * 6)],
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>

          {/* Fireworks */}
          <div className="victory-fireworks">
            {[...Array(5)].map((_, i) => (
              <div
                key={`firework-${i}`}
                className="firework"
                style={{
                  left: `${20 + (i * 15)}%`,
                  top: `${30 + Math.random() * 40}%`,
                  animationDelay: `${i * 0.3}s`
                }}
              >
                <div className="firework-explosion">
                  {[...Array(8)].map((_, j) => (
                    <div
                      key={`spark-${j}`}
                      className="firework-spark"
                      style={{
                        transform: `rotate(${j * 45}deg)`,
                        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#FFD700'][Math.floor(Math.random() * 5)]
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Victory stars */}
          <div className="victory-stars">
            {[...Array(8)].map((_, i) => (
              <div
                key={`star-${i}`}
                className="victory-star"
                style={{
                  left: `${10 + (i * 12)}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.2}s`,
                  fontSize: `${1 + Math.random() * 2}rem`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        </>
      )}

      {/* Screen flash effect */}
      <div className={`celebration-flash celebration-flash-${type}`} />
    </div>
  )
}
