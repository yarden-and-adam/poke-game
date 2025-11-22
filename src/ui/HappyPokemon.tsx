import React, { useEffect, useState } from 'react'
import { fetchPokemonByNameOrId } from '../services/pokeapi'
import { SimplePokemon } from '../types'

interface HappyPokemonProps {
  visible: boolean
  pokemonName: string
  onComplete?: () => void
}

export default function HappyPokemon({ visible, pokemonName, onComplete }: HappyPokemonProps) {
  const [dancePhase, setDancePhase] = useState(0)
  const [pokemonData, setPokemonData] = useState<SimplePokemon | null>(null)

  useEffect(() => {
    if (visible && pokemonName) {
      // Fetch Pokemon data
      fetchPokemonByNameOrId(pokemonName).then(data => {
        if (data) setPokemonData(data)
      })
    }
  }, [visible, pokemonName])

  useEffect(() => {
    if (visible) {
      setDancePhase(0)
      const timer1 = setTimeout(() => setDancePhase(1), 200)
      const timer2 = setTimeout(() => setDancePhase(2), 600)
      const timer3 = setTimeout(() => setDancePhase(3), 1000)
      const timer4 = setTimeout(() => {
        setDancePhase(4)
        onComplete?.()
      }, 1400)
      
      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    }
  }, [visible, onComplete])

  if (!visible) return null

  const getDanceAnimation = () => {
    switch (dancePhase) {
      case 0:
        return 'happy-bounce-in'
      case 1:
        return 'happy-bounce'
      case 2:
        return 'happy-spin'
      case 3:
        return 'happy-jump'
      case 4:
        return 'happy-celebrate'
      default:
        return ''
    }
  }

  return (
    <div className="happy-pokemon-overlay">
      <div className="happy-pokemon-content">
        <div className="pokemon-sprite">
          <div className={`pokemon-dance ${getDanceAnimation()}`}>
            {pokemonData ? (
              <img 
                src={pokemonData.sprite} 
                alt={pokemonName}
                style={{ 
                  width: '120px', 
                  height: '120px',
                  imageRendering: 'pixelated',
                  filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.8))'
                }} 
              />
            ) : (
              <div style={{ fontSize: '4rem' }}>🎊</div>
            )}
          </div>
          <div className="pokemon-name">{pokemonName}</div>
        </div>
        
        {/* Floating hearts for friendship */}
        <div className="floating-hearts">
          <div className="heart heart-1">💕</div>
          <div className="heart heart-2">💕</div>
          <div className="heart heart-3">💕</div>
        </div>
        
        {/* Sparkle effects */}
        <div className="sparkles">
          <div className="sparkle sparkle-1">✨</div>
          <div className="sparkle sparkle-2">⭐</div>
          <div className="sparkle sparkle-3">✨</div>
          <div className="sparkle sparkle-4">⭐</div>
          <div className="sparkle sparkle-5">✨</div>
        </div>
      </div>
    </div>
  )
}
