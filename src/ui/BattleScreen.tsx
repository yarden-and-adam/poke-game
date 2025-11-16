import React, { useEffect, useState } from 'react'
import { Player, SimplePokemon, SimpleMove, GameState, ActionType, TypeChart } from '../types'
import { calculateDamage, accuracyCheck, dodgeCheck, blockDamage } from '../game/battleEngine'
import { fetchTypeChart } from '../services/pokeapi'
import { resolveTurn } from '../game/engine'

interface BattleScreenProps {
  initialState: GameState
  onExit: () => void
  unselectedPools?: [SimplePokemon[], SimplePokemon[]]
}

export default function BattleScreen({ initialState, onExit, unselectedPools }: BattleScreenProps) {
  const [typeChart, setTypeChart] = useState<TypeChart>({})
  const [typeChartLoading, setTypeChartLoading] = useState(true)
  const [state, setState] = useState<GameState>(initialState)
  const [log, setLog] = useState<string[]>(['⚔️ Battle Start!', '🎲 Waiting for moves...'])
  const [actions, setActions] = useState<[ActionType | null, ActionType | null]>([null, null])
  const [selectedCardIdx, setSelectedCardIdx] = useState<[number | null, number | null]>([null, null])
  const [showCardMenu, setShowCardMenu] = useState<[boolean, boolean]>([false, false])
  const [showResult, setShowResult] = useState(false)
  const [lastLogs, setLastLogs] = useState<string[]>([])
  const [showEvolutionModal, setShowEvolutionModal] = useState<boolean>(false)
  const [playerEvolving, setPlayerEvolving] = useState<number | null>(null)

  useEffect(() => {
    fetchTypeChart().then(chart => {
      setTypeChart(chart)
      setTypeChartLoading(false)
    })
  }, [])

  function logAdd(s: string) {
    setLog(prev => [s, ...prev].slice(0, 50))
  }

  function pickAction(pIdx: number, action: ActionType) {
    setActions(prev => {
      const copy: any = [...prev]
      copy[pIdx] = action
      return [copy[0], copy[1]]
    })
  }

  function getLogEntryClass(log: string): string {
    if (log.includes('KO') || log.includes('fainted')) return 'ko'
    if (log.includes('Heal') || log.includes('healed') || log.includes('Revive') || log.includes('revived')) return 'heal'
    if (log.includes('damage')) return 'damage'
    return 'action'
  }

  async function nextTurn() {
    if (actions[0] === null || actions[1] === null) {
      alert('Both players must select an action!')
      return
    }
    const r = await resolveTurn(state, actions, typeChart)
    const newState = r.newState
    
    // Store logs and show modal
    setLastLogs(r.logs)
    setShowResult(true)
    
    setState(newState)
    for (const l of r.logs) logAdd(l)
    setActions([null, null])
  }

  function continueAfterResult() {
    setShowResult(false)
  }

  function useCard(pIdx: number, cardIdx: number) {
    const card = state.players[pIdx].hand[cardIdx]
    if (!card) return
    pickAction(pIdx, { kind: 'use_card', cardId: card.id })
    setSelectedCardIdx(prev => {
      const copy: any = [...prev]
      copy[pIdx] = cardIdx
      return [copy[0], copy[1]]
    })
    setShowCardMenu(prev => {
      const copy: any = [...prev]
      copy[pIdx] = false
      return [copy[0], copy[1]]
    })
  }

  function getTypeEffectiveness(moveType: string, defenderTypes: string[]) {
    let effectiveness = 'neutral'
    for (const defType of defenderTypes) {
      const tc = typeChart[defType]
      if (!tc) continue
      if (tc.zero_from.includes(moveType)) {
        effectiveness = 'immune'
        break
      }
      if (tc.double_from.includes(moveType)) {
        effectiveness = 'super-effective'
      } else if (effectiveness !== 'super-effective' && tc.half_from.includes(moveType)) {
        effectiveness = 'not-very-effective'
      }
    }
    return effectiveness
  }

  function getEffectivenessEmoji(eff: string) {
    switch (eff) {
      case 'super-effective':
        return '💥'
      case 'not-very-effective':
        return '💨'
      case 'immune':
        return '🛡️'
      default:
        return ''
    }
  }

  // Check if game is over
  if (state.gameOver) {
    const winnerIdx = state.winnerIndex ?? -1
    const winner = winnerIdx >= 0 ? state.players[winnerIdx] : null
    const totalTurns = state.turnNumber
    
    // Award random Pokémon from unselected pool to winner
    let rewardPokemon: SimplePokemon | null = null
    if (winnerIdx >= 0 && unselectedPools && unselectedPools[winnerIdx] && unselectedPools[winnerIdx].length > 0) {
      const pool = unselectedPools[winnerIdx]
      rewardPokemon = pool[Math.floor(Math.random() * pool.length)]
    }
    
    return (
      <div className="game-over-screen">
        <h2>🎉 Battle Complete! 🎉</h2>
        <div className="winner">
          {state.winnerIndex === null || state.winnerIndex === undefined ? "It's a Tie!" : `${winner?.name} Wins!`}
        </div>
        
        {rewardPokemon && winnerIdx >= 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
            padding: '20px',
            borderRadius: '8px',
            margin: '20px auto',
            maxWidth: '300px',
            textAlign: 'center',
            border: '3px solid #ffa500'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px' }}>🏆 Prize Pokémon!</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <img src={rewardPokemon.sprite} alt={rewardPokemon.name} style={{ width: '80px', height: '80px' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#333' }}>{rewardPokemon.name}</div>
                <div style={{ fontSize: '0.85rem', color: '#555' }}>
                  {rewardPokemon.types.map(t => (
                    <span key={t} className={`type-badge type-${t.toLowerCase()}`} style={{ marginRight: '4px', display: 'inline-block' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '20px',
          width: '100%',
          maxWidth: '400px',
          margin: '20px auto'
        }}>
          {state.players.map((p, idx) => (
            <div key={p.id} style={{
              background: '#f8f9fa',
              padding: '15px',
              borderRadius: '8px',
              border: `2px solid ${state.winnerIndex === idx ? '#ffd700' : '#ddd'}`
            }}>
              <div style={{ fontWeight: '600', marginBottom: '10px' }}>{p.name}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>
                <div>⭐ <strong>{p.points}</strong> Points</div>
                <div>💪 <strong>{p.bench.filter(pk => !pk.fainted).length}</strong> Pokémon Left</div>
                <div>❤️ <strong>{Math.max(0, Math.floor(p.bench.reduce((sum, pk) => sum + (pk.fainted ? 0 : pk.currentHp), 0)))}</strong> Total HP</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ color: '#999', fontSize: '0.9rem', marginTop: '20px' }}>
          Battle lasted <strong>{totalTurns}</strong> turn{totalTurns !== 1 ? 's' : ''}
        </div>

        <button onClick={onExit} style={{ padding: '14px 40px', fontSize: '1.1rem', marginTop: '20px' }}>
          ← Back to Menu
        </button>
      </div>
    )
  }

  if (typeChartLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'white' }}>
        <div style={{ fontSize: '2rem', marginBottom: '20px' }}>⚡</div>
        <h2>Loading Battle Data...</h2>
        <div className="loading-spinner" style={{ margin: '20px auto' }}></div>
        <p>Preparing type matchups...</p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '20px' }}>⚡ Battle in Progress (Turn {state.turnNumber}) ⚡</h2>

      <div className="battle-control">
        <button className="next-turn-button" onClick={nextTurn}>
          ⚡ Resolve Turn ⚡
        </button>
        <button className="exit-button" onClick={onExit}>
          Exit Battle
        </button>
      </div>

      <div className="battle-container">
        {state.players.map((p, i) => {
          const active = p.bench[p.activeIndex]
          const hpPercent = (active.currentHp / active.maxHp) * 100
          const hpClass = hpPercent > 50 ? '' : hpPercent > 25 ? 'warning' : 'critical'
          const hasSelectedAction = actions[i] !== null

          return (
            <div key={p.id} className="battle-player" style={{ borderLeft: hasSelectedAction ? '4px solid #4caf50' : '4px solid #ddd' }}>
              <h3>
                {p.name}
                {hasSelectedAction && <span className="status-indicator status-ready">✓ Ready</span>}
                {!hasSelectedAction && <span className="status-indicator status-waiting">⏳ Waiting</span>}
              </h3>
              <div className="player-stats">
                <span>Turn {state.turnNumber}</span>
                <span className="points-badge">⭐ {p.points} Points</span>
              </div>

              <div className="action-panel">
                <div className="move-buttons">
                  {active.pokemon.moves.map((m, mi) => {
                    const opponent = state.players[i === 0 ? 1 : 0].bench[state.players[i === 0 ? 1 : 0].activeIndex]
                    const eff = getTypeEffectiveness(m.type, opponent.pokemon.types)
                    const effEmoji = getEffectivenessEmoji(eff)
                    return (
                      <button
                        key={`${active.pokemon.id}-${mi}`}
                        className={`move-button ${eff !== 'neutral' ? eff : ''} ${actions[i]?.kind === 'attack' && (actions[i] as any).moveIndex === mi ? 'selected' : ''}`}
                        onClick={() => pickAction(i, { kind: 'attack', moveIndex: mi })}
                        disabled={active.fainted}
                        title={`Type: ${m.type} vs ${opponent.pokemon.types.join('/')} - ${eff}\nAccuracy: ${m.accuracy || 100}%`}
                      >
                        <div>{m.name} {effEmoji}</div>
                        <div className="move-power">{m.type} | Pow: {m.power || 0} | Acc: {m.accuracy || 100}%</div>
                      </button>
                    )
                  })}
                </div>

                <div className="action-buttons">
                  <button
                    className={`action-button dodge ${actions[i]?.kind === 'dodge' ? 'selected' : ''}`}
                    onClick={() => pickAction(i, { kind: 'dodge' })}
                    disabled={active.fainted}
                  >
                    💨 Dodge
                  </button>
                  <button
                    className={`action-button block ${actions[i]?.kind === 'block' ? 'selected' : ''}`}
                    onClick={() => pickAction(i, { kind: 'block' })}
                    disabled={active.fainted}
                  >
                    🛡️ Block
                  </button>
                  <button
                    className={`action-button ${actions[i]?.kind === 'switch' ? 'selected' : ''}`}
                    onClick={() => {
                      const availableSwitches = p.bench.filter((_, idx) => idx !== p.activeIndex && !p.bench[idx].fainted)
                      if (availableSwitches.length === 0) {
                        alert('No available Pokémon to switch to!')
                        return
                      }
                      pickAction(i, { kind: 'switch', benchIndex: p.bench.indexOf(availableSwitches[0]) })
                    }}
                    disabled={active.fainted || p.bench.filter((_, idx) => idx !== p.activeIndex && !p.bench[idx].fainted).length === 0}
                    style={{ background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)' }}
                  >
                    🔄 Switch
                  </button>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => setShowCardMenu(prev => {
                      const copy: any = [...prev]
                      copy[i] = !copy[i]
                      return [copy[0], copy[1]]
                    })}
                    className={`action-button ${showCardMenu[i] ? 'active' : ''}`}
                    disabled={p.hand.length === 0}
                  >
                    🃏 Cards ({p.hand.length})
                  </button>
                </div>

                {showCardMenu[i] && (
                  <div className="card-grid">
                    {p.hand.map((card, cidx) => (
                      <div
                        key={card.id}
                        className={`card-item ${actions[i]?.kind === 'use_card' && (actions[i] as any).cardId === card.id ? 'selected' : ''}`}
                        onClick={() => useCard(i, cidx)}
                        title={card.description}
                      >
                        <div className="card-name">{card.name}</div>
                        <div className="card-type">{card.type}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="active-pokemon">
                <div className="active-pokemon-name">{active.pokemon.name}</div>
                <div className="pokemon-types">
                  {active.pokemon.types.map(t => (
                    <span key={t} className={`type-badge type-${t.toLowerCase()}`}>
                      {t}
                    </span>
                  ))}
                </div>
                <img src={active.pokemon.sprite} alt={active.pokemon.name} />

                <div className="hp-bar-container">
                  <div className="hp-label">
                    <span>HP</span>
                    <span>
                      {Math.max(0, active.currentHp)}/{active.maxHp}
                    </span>
                  </div>
                  <div className="hp-bar">
                    <div
                      className={`hp-fill ${hpClass}`}
                      style={{ width: `${Math.max(0, hpPercent)}%` }}
                    >
                      {hpPercent > 10 && `${Math.round(hpPercent)}%`}
                    </div>
                  </div>
                </div>

                <div className="pokemon-types">
                  {active.pokemon.types.map(t => (
                    <span key={t} className={`type-badge type-${t.toLowerCase()}`}>
                      {t}
                    </span>
                  ))}
                </div>

                {active.shielded && <div className="condition-badge condition-shield">🛡️ Shielded</div>}
                {active.boostedAtkTurns && active.boostedAtkTurns > 0 && (
                  <div className="condition-badge condition-boost">⚡ Boosted ({active.boostedAtkTurns} turns)</div>
                )}
              </div>

              <div className="bench-section">
                <h5>Bench ({p.bench.filter((pk, idx) => idx !== p.activeIndex).length} available)</h5>
                <div className="bench-pokemon">
                  {p.bench.map((pp, idx) => (
                    <div
                      key={pp.pokemon.id}
                      className={`bench-pokemon-card ${idx === p.activeIndex ? 'active' : ''} ${pp.fainted ? 'fainted' : ''}`}
                      onClick={() => {
                        if (idx !== p.activeIndex && !pp.fainted) {
                          pickAction(i, { kind: 'switch', benchIndex: idx })
                        }
                      }}
                      title={pp.fainted ? 'Fainted' : pp.pokemon.name}
                    >
                      <img src={pp.pokemon.sprite} alt={pp.pokemon.name} />
                      <div className="bench-pokemon-types" style={{ display: 'flex', gap: '2px', justifyContent: 'center', marginTop: '2px' }}>
                        {pp.pokemon.types.map(t => (
                          <span key={t} className={`type-badge-small type-${t.toLowerCase()}`} title={t}>
                            {t.charAt(0).toUpperCase()}
                          </span>
                        ))}
                      </div>
                      <div className="bench-pokemon-name">{pp.pokemon.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="battle-log-container">
        <h4>📜 Battle Log</h4>
        <div className="battle-log">
          {log.map((l, idx) => (
            <div key={idx} className={`log-entry ${getLogEntryClass(l)}`}>
              {l}
            </div>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="help-modal">
          <div className="help-content" style={{ maxWidth: '600px' }}>
            <h2>Turn {state.turnNumber - 1} Results</h2>
            <div className="battle-log" style={{ maxHeight: '300px', marginBottom: '20px' }}>
              {lastLogs.map((l, idx) => {
                const isSuperEffective = l.includes('Super Effective')
                const isNotVeryEffective = l.includes('Not very effective')
                const isDodged = l.includes('dodged')
                const isHealed = l.includes('Heal') || l.includes('healed') || l.includes('Revive') || l.includes('revived')
                const isKO = l.includes('KO') || l.includes('fainted')
                
                return (
                  <div 
                    key={idx} 
                    className={`log-entry ${getLogEntryClass(l)}`}
                    style={
                      isSuperEffective ? { 
                        backgroundColor: 'rgba(255, 107, 107, 0.3)', 
                        borderLeft: '4px solid #ff6b6b' 
                      } : isNotVeryEffective ? {
                        backgroundColor: 'rgba(100, 100, 100, 0.2)',
                        borderLeft: '4px solid #666'
                      } : {}
                    }
                  >
                    {isSuperEffective ? '💥 ' : isDodged ? '💨 ' : isHealed ? '✨ ' : isKO ? '💀 ' : ''}
                    {l}
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
              {state.players.map((p, idx) => (
                <div key={p.id} style={{
                  background: '#f8f9fa',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '8px' }}>{p.name}</div>
                  <div>⭐ Points: <strong>{p.points}</strong></div>
                  <div>❤️ HP: <strong>{Math.max(0, Math.floor(p.bench.reduce((sum, pk) => sum + (pk.fainted ? 0 : pk.currentHp), 0)))}</strong></div>
                </div>
              ))}
            </div>
            <button
              onClick={continueAfterResult}
              style={{ width: '100%', padding: '12px', fontSize: '1rem' }}
            >
              Continue Battle
            </button>
          </div>
        </div>
      )}


    </div>
  )
}
