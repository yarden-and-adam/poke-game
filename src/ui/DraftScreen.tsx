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

  function unpickPokemon(playerIdx: number, pokemonId: number) {
    setPlayers(prev => {
      const result = [...prev]
      const player = result[playerIdx]
      const newPicks = player.picks.filter(p => p.id !== pokemonId)
      result[playerIdx] = { ...player, picks: newPicks }
      return result
    })
  }

  function isPicked(playerIdx: number, pokemonId: number): boolean {
    return players[playerIdx].picks.some(p => p.id === pokemonId)
  }

  if (loading) {
    return (
      <div className="pool-section" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <div className="pokeball-loader">
          <div className="pokeball">
            <div className="pokeball-top"></div>
            <div className="pokeball-middle"></div>
            <div className="pokeball-bottom"></div>
            <div className="pokeball-button"></div>
          </div>
        </div>
        <h2 style={{ marginTop: '30px', marginBottom: '10px' }}>Loading Pokémon...</h2>
        <p style={{ color: 'var(--theme-text-secondary)' }}>Gathering fighters from around the world...</p>
      </div>
    )
  }

  return (
    <div className="draft-screen-container">
      <h2 className="draft-title">⚔️ Draft Your Team</h2>

      <div className="draft-grid">
        {players.map((player, playerIdx) => (
          <div key={player.id} className="draft-player-section">
            <div className="draft-player-header">
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
              <div className={`draft-counter ${player.picks.length === 6 ? 'complete' : ''}`}>
                {player.picks.length}/6 Ready
              </div>
            </div>

            <div className="selected-team-container">
              <div className="selected-team-label">Your Squad</div>
              <div className="selected-team-slots">
                {Array.from({ length: 6 }).map((_, i) => {
                  const pick = player.picks[i]
                  return (
                    <div key={i} className={`team-slot ${pick ? 'filled' : 'empty'}`}>
                      {pick ? (
                        <>
                          <button
                            className="remove-pick-btn"
                            onClick={() => unpickPokemon(playerIdx, pick.id)}
                            title="Remove"
                          >✕</button>
                          <img src={pick.sprite} alt={pick.name} className="slot-sprite" />
                          <div className="slot-name">{pick.name}</div>
                        </>
                      ) : (
                        <div className="empty-slot-indicator">{i + 1}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="available-pool-section">
              <h4 className="pool-label">Available Recruits</h4>
              <div className="pokemon-pool-grid">
                {pools[playerIdx].map((p: SimplePokemon) => {
                  const picked = isPicked(playerIdx, p.id)
                  return (
                    <div
                      key={p.id}
                      className={`pool-card ${picked ? 'picked' : ''}`}
                      onClick={() => !picked && player.picks.length < 6 && pickPokemon(playerIdx, p)}
                    >
                      <div className="pool-card-inner">
                        <img src={p.sprite} alt={p.name} className="pool-sprite" />
                        <div className="pool-info">
                          <div className="pool-name">{p.name}</div>
                          <div className="pool-types">
                            {p.types.map((t: string) => (
                              <span key={t} className={`type-dot type-${t.toLowerCase()}`} title={t} />
                            ))}
                          </div>
                        </div>
                        {picked && <div className="picked-overlay">✓</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="start-game-bar">
        <button
          className={`start-battle-btn ${players[0].picks.length === 6 && players[1].picks.length === 6 ? 'ready' : 'disabled'}`}
          onClick={() => {
            if (players[0].picks.length === 6 && players[1].picks.length === 6) {
              const unselected1 = pools[0].filter(p => !players[0].picks.some(pick => pick.id === p.id))
              const unselected2 = pools[1].filter(p => !players[1].picks.some(pick => pick.id === p.id))
              onComplete(players[0], players[1], unselected1, unselected2)
            }
          }}
          disabled={players[0].picks.length !== 6 || players[1].picks.length !== 6}
        >
          {players[0].picks.length === 6 && players[1].picks.length === 6
            ? '⚡ START BATTLE ⚡'
            : 'Waiting for both players...'}
        </button>
      </div>
    </div>
  )
}