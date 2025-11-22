import React, { useEffect, useState } from 'react'
import { SimplePokemon } from '../types'

interface BattleEntryAnimationProps {
  visible: boolean
  pokemon: SimplePokemon | null
  onComplete?: () => void
}

export default function BattleEntryAnimation({ visible, pokemon, onComplete }: BattleEntryAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    if (visible && pokemon) {
      setAnimationPhase(0)
      const timer1 = setTimeout(() => setAnimationPhase(1), 300)
      const timer2 = setTimeout(() => setAnimationPhase(2), 800)
      const timer3 = setTimeout(() => setAnimationPhase(3), 1200)
      const timer4 = setTimeout(() => {
        setAnimationPhase(4)
        onComplete?.()
      }, 1600)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }
  }, [visible, pokemon, onComplete])

  if (!visible || !pokemon) return null

  const getEntryAnimation = () => {
    switch (animationPhase) {
      case 0:
        return 'entry-dramatic-appear'
      case 1:
        return 'entry-impact'
      case 2:
        return 'entry-pose'
      case 3:
        return 'entry-ready'
      case 4:
        return 'entry-complete'
      default:
        return ''
    }
  }

  const getTypeColor = () => {
    const typeColors: { [key: string]: string } = {
      fire: '#FF6B35',
      water: '#4FC3F7',
      grass: '#66BB6A',
      electric: '#FFD700',
      psychic: '#BA68C8',
      ice: '#B3E5FC',
      ground: '#8D6E63',
      flying: '#90CAF9',
      bug: '#9CCC65',
      rock: '#A1887F',
      ghost: '#CE93D8',
      dragon: '#FF7043',
      dark: '#5D4037',
      steel: '#B0BEC5',
      fairy: '#F8BBD0',
      fighting: '#EF5350',
      poison: '#AB47BC',
      normal: '#E0E0E0'
    }
    return typeColors[pokemon.types[0]] || '#E0E0E0'
  }

  return (
    <div className="battle-entry-overlay">
      <div className="battle-entry-content">
        {/* Dramatic entrance effect */}
        <div className="entry-pokemon-container">
          <div className={`entry-pokemon-sprite ${getEntryAnimation()}`}>
            <img 
              src={pokemon.sprite} 
              alt={pokemon.name}
              style={{
                width: '120px',
                height: '120px',
                imageRendering: 'pixelated',
                filter: `drop-shadow(0 0 20px ${getTypeColor()})`
              }}
            />
          </div>
          
          {/* Entry aura */}
          <div 
            className="entry-aura"
            style={{
              backgroundColor: getTypeColor(),
              boxShadow: `0 0 40px ${getTypeColor()}`
            }}
          />
        </div>
        
        {/* Pokémon name announcement */}
        <div className="entry-name-announcement">
          <div className="entry-pokemon-name">{pokemon.name}</div>
          <div className="entry-types">
            {pokemon.types.map((type, index) => (
              <span 
                key={index} 
                className="entry-type-badge"
                style={{ backgroundColor: getTypeColor() }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
        
        {/* Entry effects */}
        <div className="entry-effects">
          {/* Light beams */}
          <div className="entry-light-beam beam-1" />
          <div className="entry-light-beam beam-2" />
          <div className="entry-light-beam beam-3" />
          <div className="entry-light-beam beam-4" />
          
          {/* Energy particles */}
          <div className="entry-particles">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="entry-particle"
                style={{
                  backgroundColor: getTypeColor(),
                  left: `${50 + Math.cos(i * 30 * Math.PI / 180) * 40}%`,
                  top: `${50 + Math.sin(i * 30 * Math.PI / 180) * 40}%`,
                  animationDelay: `${i * 0.05}s`
                }}
              />
            ))}
          </div>
          
          {/* Impact shockwave */}
          <div className="entry-shockwave" />
        </div>
      </div>
    </div>
  )
}