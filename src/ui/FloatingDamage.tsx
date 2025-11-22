import React, { useEffect, useState } from 'react'

interface FloatingDamageProps {
  damage: number
  type: 'normal' | 'critical' | 'heal' | 'super-effective' | 'not-very-effective'
  position: { x: number, y: number }
  visible: boolean
  onComplete?: () => void
}

export default function FloatingDamage({ 
  damage, 
  type, 
  position, 
  visible, 
  onComplete 
}: FloatingDamageProps) {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (visible && damage > 0) {
      setShouldShow(true)
      const timer = setTimeout(() => {
        setShouldShow(false)
        onComplete?.()
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [visible, damage, onComplete])

  if (!shouldShow) return null

  const getDamageConfig = () => {
    switch (type) {
      case 'critical':
        return {
          emoji: '💥',
          color: '#ff6b6b',
          bgColor: 'rgba(255, 107, 107, 0.2)',
          size: 'extra-large',
          animation: 'critical-bounce'
        }
      case 'super-effective':
        return {
          emoji: '💥',
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.2)',
          size: 'large',
          animation: 'super-effective-pop'
        }
      case 'not-very-effective':
        return {
          emoji: '💨',
          color: '#6c757d',
          bgColor: 'rgba(108, 117, 125, 0.2)',
          size: 'small',
          animation: 'not-very-effective-fade'
        }
      case 'heal':
        return {
          emoji: '💚',
          color: '#10b981',
          bgColor: 'rgba(16, 185, 129, 0.2)',
          size: 'large',
          animation: 'heal-float'
        }
      default:
        return {
          emoji: '💢',
          color: '#ffc107',
          bgColor: 'rgba(255, 193, 7, 0.2)',
          size: 'normal',
          animation: 'normal-float'
        }
    }
  }

  const config = getDamageConfig()

  return (
    <div
      className={`floating-damage floating-damage-${config.size} floating-damage-${config.animation}`}
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        color: config.color,
        backgroundColor: config.bgColor,
        zIndex: 1000,
        pointerEvents: 'none'
      }}
    >
      <div className="floating-damage-emoji">{config.emoji}</div>
      <div className="floating-damage-number">{damage}</div>
    </div>
  )
}
