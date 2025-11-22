import React, { useState } from 'react'
import DraftScreen from './ui/DraftScreen'
import BattleScreen from './ui/BattleScreen'
import ThemeSelector from './ui/ThemeSelector'
import ThemeEffects from './ui/ThemeEffects'
import { Player, SimplePokemon } from './types'
import { buildGameState } from './game/engine'
import { useTheme } from './ThemeContext' // Import useTheme

export default function App() {
  const [phase, setPhase] = useState<'start' | 'draft' | 'battle'>('start')
  const [showHelp, setShowHelp] = useState(false)
  const [localP1, setLocalP1] = useState<Player | null>(null)
  const [localP2, setLocalP2] = useState<Player | null>(null)
  const [gameState, setGameState] = useState<any | null>(null)
  const [unselectedPools, setUnselectedPools] = useState<[SimplePokemon[], SimplePokemon[]] | null>(null)
  const { theme, themeName, toggleTheme } = useTheme() // Use the theme hook

  return (
    <div className={`app theme-${themeName.toLowerCase()}`}>
      <ThemeEffects themeId={themeName.toLowerCase()} />
      <div className="theme-controls">
        <button onClick={toggleTheme} className="theme-toggle-button">
          {themeName === 'Dark' ? '☀️' : '🌙'}
        </button>
        <ThemeSelector />
      </div>
      <h1>⚡ Pokémon Battle Arena ⚡</h1>
      {phase === 'start' && (
        <>
          <div className="start-screen">
            <div className="start-screen-text">
              <p className="start-screen-welcome">
                Welcome to the ultimate Pokémon battle experience!
              </p>
              <p className="start-screen-description">
                Pick your team and battle your opponent. Use strategy, cards, and type advantages to win!
              </p>
            </div>
            <div className="start-screen-buttons">
              <button
                className="start-button"
                onClick={() => {
                  setPhase('draft')
                }}
              >
                🎮 Start Draft
              </button>
              <button
                className="how-to-play-button"
                onClick={() => setShowHelp(!showHelp)}
              >
                ❓ How to Play
              </button>
            </div>
          </div>

          {showHelp && (
            <div className="help-modal">
              <div className="help-content">
                <button
                  className="close-help-button"
                  onClick={() => setShowHelp(false)}
                >
                  ✕
                </button>
                <h2>🎮 How to Play</h2>
                <div className="help-columns">
                  <h3>⚔️ Battle Mechanics</h3>
                  <p>
                    <strong>Attack:</strong> Use a move to damage opponent
                    <br />
                    <strong>Dodge:</strong> 20% chance to avoid damage
                    <br />
                    <strong>Block:</strong> Reduce incoming damage by 50%
                    <br />
                    <strong>Switch:</strong> Change active Pokémon
                  </p>

                  <h3>💥 Type Matchups</h3>
                  <p>
                    <strong>Super Effective:</strong> 2x damage (water→fire, fire→grass)
                    <br />
                    <strong>Not Very Effective:</strong> 0.5x damage
                    <br />
                    <strong>STAB:</strong> 1.5x damage for same type
                  </p>

                  <h3>🃏 Special Cards</h3>
                  <p>
                    <strong>Draw on KO:</strong> Knockout = 1 point + draw card
                    <br />
                    <strong>Heal:</strong> Restore HP (30% or 60%)
                    <br />
                    <strong>Revive:</strong> Bring back fainted Pokémon
                    <br />
                    <strong>Boost:</strong> +20% attack for 2 turns
                  </p>

                  <h3>⭐ Winning</h3>
                  <p>
                    First to knock out all opponent Pokémon wins!
                    <br />
                    <strong>Tie-breaker:</strong> Most points, then remaining HP
                  </p>

                  <h3>💡 Tips</h3>
                  <p>
                    • Watch for type advantages
                    <br />
                    • Faster Pokémon attack first
                    <br />
                    • Save rare cards for key moments
                    <br />
                    • Balance your team composition
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {phase === 'draft' && (
        <DraftScreen
          onComplete={(player1: Player, player2: Player, unselected1, unselected2) => {
            setLocalP1(player1)
            setLocalP2(player2)
            // build game state
            setGameState(buildGameState(player1, player2, unselected1, unselected2))
            setUnselectedPools([unselected1, unselected2])
            setPhase('battle')
          }}
        />
      )}

      {phase === 'battle' && gameState && (
        <BattleScreen initialState={gameState} onExit={() => setPhase('start')} unselectedPools={unselectedPools || undefined} />
      )}
    </div>
  )
}
