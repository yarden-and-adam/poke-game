import React, { useEffect, useState } from 'react'
import { SimplePokemon, Player } from '../types'
import { fetchRandomPokemonPool } from '../services/pokeapi'

interface DraftScreenProps {
  onComplete: (p1: Player, p2: Player, unselectedPool1: SimplePokemon[], unselectedPool2: SimplePokemon[]) => void
}

export default function DraftScreen({ onComplete }: DraftScreenProps) {
  const [player1Name, setPlayer1Name] = useState('Player 1')
  const [player2Name, setPlayer2Name] = useState('Player 2')
  const [pools, setPools] = useState<[SimplePokemon[], SimplePokemon[]]>([[], []])
  const [players, setPlayers] = useState<Player[]>([
    { id: 'p1', name: player1Name, picks: [] },
    { id: 'p2', name: player2Name, picks: [] },
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setPlayers(prev => [
      { ...prev[0], name: player1Name },
      { ...prev[1], name: player2Name },
    ])
  }, [player1Name, player2Name])

  useEffect(() => {
    Promise.all([fetchRandomPokemonPool(20), fetchRandomPokemonPool(20)]).then(([pool1, pool2]) => {
      setPools([pool1, pool2])
      setLoading(false)
    })
  }, [])

  function pickPokemon(playerIdx: number, pokemon: SimplePokemon) {
    setPlayers(prev => {
      const result = [...prev]
      if (result[playerIdx].picks.length >= 6) return result
      const newName = playerIdx === 0 ? player1Name : player2Name
      result[playerIdx] = { ...result[playerIdx], name: newName, picks: [...result[playerIdx].picks, pokemon] }
      return result
    })
  }

  function isPicked(playerIdx: number, pokemonId: number): boolean {
    return players[playerIdx].picks.some(p => p.id === pokemonId)
  }

  if (loading) {
    return (
      <div className="pool-section" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Loading Pokémon...</h2>
        <p>Getting the best fighters for you...</p>
        <div style={{ marginTop: '20px', fontSize: '2rem' }}>⚡</div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>⚔️ Draft Your Team</h2>
      <div className="draft-container">
        {players.map((player, playerIdx) => (
          <div key={player.id} className="player-section">
            <h3>
              <input
                type="text"
                value={playerIdx === 0 ? player1Name : player2Name}
                onChange={e => {
                  if (playerIdx === 0) setPlayer1Name(e.target.value)
                  else setPlayer2Name(e.target.value)
                }}
                className="player-name-input"
                aria-label={`Player ${playerIdx + 1} Name`}
              />
            </h3>
            <div style={{ marginBottom: '15px', fontSize: '1.1rem', fontWeight: '600', color: '#667eea' }}>
              Selected: {player.picks.length}/6
            </div>
            <div className="pokemon-grid">
              {player.picks.map(p => (
                <div key={p.id} className="pokemon-card">
                  <img src={p.sprite} alt={p.name} />
                  <div className="pokemon-card-name">{p.name}</div>
                  <div className="pokemon-types">
                    {p.types.map(t => (
                      <span key={t} className={`type-badge type-${t.toLowerCase()}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ marginTop: '20px', color: '#666' }}>Available for {playerIdx === 0 ? player1Name : player2Name}</h4>
            <div className="pokemon-pool-grid">
              {pools[playerIdx].map((p: SimplePokemon) => (
                <div
                  key={p.id}
                  className={`pool-pokemon-card ${isPicked(playerIdx, p.id) ? 'disabled' : ''}`}
                  style={{ opacity: isPicked(playerIdx, p.id) ? 0.5 : 1 }}
                >
                  <img src={p.sprite} alt={p.name} />
                  <div className="pokemon-card-name">{p.name}</div>
                  <div className="pokemon-types">
                    {p.types.map((t: string) => (
                      <span key={t} className={`type-badge type-${t.toLowerCase()}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    className="pick-button"
                    onClick={() => pickPokemon(playerIdx, p)}
                    disabled={player.picks.length >= 6 || isPicked(playerIdx, p.id)}
                  >
                    {isPicked(playerIdx, p.id) ? '✓ Picked' : 'Pick'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="start-game-section">
        <button
          onClick={() => {
            if (players[0].picks.length === 6 && players[1].picks.length === 6) {
              const unselected1 = pools[0].filter(p => !players[0].picks.some(pick => pick.id === p.id))
              const unselected2 = pools[1].filter(p => !players[1].picks.some(pick => pick.id === p.id))
              onComplete(players[0], players[1], unselected1, unselected2)
            }
            else alert('Both players must pick 6 Pokémon!')
          }}
          style={{ padding: '14px 40px', fontSize: '1.1rem' }}
        >
          ⚡ Start Battle ⚡
        </button>
      </div>
    </div>
  )
}
