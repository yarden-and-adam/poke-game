import React from 'react'

interface TypeIndicatorProps {
  effectiveness: 'super' | 'not-very' | 'immune' | 'normal'
  showEmoji: boolean
  size?: 'small' | 'medium' | 'large'
}

export default function TypeIndicator({
  effectiveness,
  showEmoji,
  size = 'medium'
}: TypeIndicatorProps) {
  const configs = {
    super: {
      emoji: '💥',
      color: 'var(--color-success)',
      text: '+',
      bgColor: 'rgba(16, 185, 129, 0.2)'
    },
    'not-very': {
      emoji: '💨',
      color: 'var(--color-warning)',
      text: '-',
      bgColor: 'rgba(245, 158, 11, 0.2)'
    },
    immune: {
      emoji: '🛡️',
      color: 'var(--color-text-secondary)',
      text: '--',
      bgColor: 'rgba(173, 181, 189, 0.2)'
    },
    normal: {
      emoji: '',
      color: 'var(--color-text)',
      text: '',
      bgColor: 'transparent'
    }
  }

  const config = configs[effectiveness]
  const sizeClasses = {
    small: 'type-indicator-small',
    medium: 'type-indicator-medium',
    large: 'type-indicator-large'
  }

  return (
    <div className={`type-indicator ${sizeClasses[size]}`} style={{
      backgroundColor: config.bgColor,
      color: config.color,
      border: `2px solid ${config.color}`
    }}>
      {showEmoji && config.emoji && (
        <span className="type-emoji">{config.emoji}</span>
      )}
      {config.text && (
        <span className="type-text">{config.text}</span>
      )}
    </div>
  )
}
