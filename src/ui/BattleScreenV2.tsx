import React, { useEffect, useState } from 'react'
import { Player, SimplePokemon, GameState, ActionType, TypeChart, BattleEvent } from '../types'
import { resolveTurn } from '../game/engine'
import { fetchTypeChart } from '../services/pokeapi'
import PowerUpEffect from './PowerUpEffect'
import BattleEntryAnimation from './BattleEntryAnimation'
import WeatherOverlay from './WeatherOverlay'
import ActionPopup from './ActionPopup'

// --- Styles (Scoped) ---
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-md)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--spacing-md)',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: 'var(--spacing-sm)',
    },
    turnTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: 'var(--theme-text)',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: 0,
    },
    fightButtonContainer: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: 'var(--spacing-lg)',
        zIndex: 10,
    },
    fightButton: {
        padding: '12px 48px',
        fontSize: '1.5rem',
        fontWeight: '900',
        borderRadius: 'var(--radius-full)',
        background: 'linear-gradient(135deg, var(--theme-success), #059669)',
        color: 'white',
        border: '4px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        textTransform: 'uppercase' as const,
        letterSpacing: '2px',
    },
    battleField: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-xl)',
        alignItems: 'start',
    },
    playerCard: {
        background: 'var(--theme-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--theme-border)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--spacing-md)',
        position: 'relative' as const,
        transition: 'transform 0.3s ease',
    },
    pokemonDisplay: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: 'var(--spacing-sm)',
        padding: 'var(--spacing-md)',
        background: 'var(--theme-background)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--theme-border)',
        minHeight: '300px',
        justifyContent: 'center',
        position: 'relative' as const,
    },
    spriteContainer: {
        position: 'relative' as const,
        width: '200px',
        height: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    sprite: {
        width: '100%',
        height: '100%',
        objectFit: 'contain' as const,
        filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
        transition: 'all 0.5s ease',
    },
    faintedSprite: {
        filter: 'grayscale(100%) brightness(0.7) blur(2px)',
        opacity: 0.6,
        transform: 'scale(0.9) translateY(10px)',
    },
    faintedOverlay: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: 'var(--radius-md)',
        color: 'white',
        fontSize: '2rem',
        fontWeight: 'bold',
        textShadow: '0 2px 4px black',
        zIndex: 5,
    },
    hpBarContainer: {
        width: '100%',
        height: '24px',
        background: 'var(--theme-border)',
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        position: 'relative' as const,
        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    },
    hpBarFill: {
        height: '100%',
        transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.75rem',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
    },
    actionPanel: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-sm)',
    },
    moveButton: {
        padding: '12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--theme-border)',
        background: 'var(--theme-surface)',
        color: 'var(--theme-text)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        gap: '4px',
        position: 'relative' as const,
    },
    superMoveButton: {
        gridColumn: '1 / -1',
        padding: '16px',
        borderRadius: 'var(--radius-md)',
        fontWeight: 'bold',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        transition: 'all 0.3s',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
    },
    modalOverlay: {
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modalContent: {
        background: 'var(--theme-surface)',
        color: 'var(--theme-text)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '600px',
        width: '90%',
        boxShadow: 'var(--shadow-xl)',
        border: '1px solid var(--theme-border)',
    },
}

interface BattleScreenProps {
    initialState: GameState
    onExit: () => void
    unselectedPools?: [SimplePokemon[], SimplePokemon[]]
}

export default function BattleScreenV2({ initialState, onExit, unselectedPools }: BattleScreenProps) {
    const [state, setState] = useState<GameState>(initialState)
    const [typeChart, setTypeChart] = useState<TypeChart>({})
    const [actions, setActions] = useState<[ActionType | null, ActionType | null]>([null, null])
    const [showResult, setShowResult] = useState(false)
    const [lastLogs, setLastLogs] = useState<string[]>([])
    const [battleEvents, setBattleEvents] = useState<BattleEvent[]>([])
    const [currentEvent, setCurrentEvent] = useState<BattleEvent | null>(null)
    const [powerUpEffects, setPowerUpEffects] = useState<Array<{ id: string, type: string, position: { x: number, y: number } }>>([])

    useEffect(() => {
        fetchTypeChart().then(setTypeChart)
    }, [])

    // --- Helpers ---
    function getEffectivenessIndicator(eff: string) {
        switch (eff) {
            case 'super-effective': return <span style={{ color: 'var(--theme-success)', fontWeight: 'bold' }}>++</span>
            case 'not-very-effective': return <span style={{ color: 'var(--theme-danger)', fontWeight: 'bold' }}>-</span>
            case 'immune': return <span style={{ color: 'var(--theme-text-secondary)', fontWeight: 'bold' }}>--</span>
            default: return <span style={{ color: 'var(--theme-text-secondary)' }}>+</span>
        }
    }

    function getTypeEffectiveness(moveType: string, defenderTypes: string[]) {
        let effectiveness = 'neutral'
        for (const defType of defenderTypes) {
            const tc = typeChart[defType]
            if (!tc) continue
            if (tc.zero_from.includes(moveType)) return 'immune'
            if (tc.double_from.includes(moveType)) effectiveness = 'super-effective'
            else if (effectiveness !== 'super-effective' && tc.half_from.includes(moveType)) effectiveness = 'not-very-effective'
        }
        return effectiveness
    }

    function pickAction(pIdx: number, action: ActionType) {
        setActions(prev => {
            const copy: any = [...prev]
            copy[pIdx] = action
            return [copy[0], copy[1]]
        })
    }

    async function nextTurn() {
        if (!actions[0] || !actions[1]) {
            alert('Both players must select an action!')
            return
        }
        const r = await resolveTurn(state, actions, typeChart)
        setLastLogs(r.logs)

        // Check win condition
        const p1AllFainted = r.newState.players[0].bench.every(b => b.fainted)
        const p2AllFainted = r.newState.players[1].bench.every(b => b.fainted)

        if (p1AllFainted || p2AllFainted) {
            // Game over - show winner
            const winner = p1AllFainted ? r.newState.players[1] : r.newState.players[0]
            const loser = p1AllFainted ? r.newState.players[0] : r.newState.players[1]

            setTimeout(() => {
                alert(`🏆 ${winner.name} WINS! 🏆\n\nFinal Score:\n${winner.name}: ${winner.points} points\n${loser.name}: ${loser.points} points`)
                onExit()
            }, 1000)

            setState(r.newState)
            setActions([null, null])
            return
        }

        if (r.events && r.events.length > 0) {
            setBattleEvents(r.events)
            setCurrentEvent(r.events[0])
        } else {
            setShowResult(true)
        }
        setState(r.newState)
        setActions([null, null])
    }

    // --- Render ---
    return (
        <div style={styles.container}>
            <WeatherOverlay weather={state.weather} />

            {/* Header */}
            <div style={styles.header}>
                <h2 style={styles.turnTitle}>⚡ Turn {state.turnNumber} ⚡</h2>
            </div>

            {/* Fight Button */}
            <div style={styles.fightButtonContainer}>
                <button
                    style={{
                        ...styles.fightButton,
                        opacity: actions[0] && actions[1] ? 1 : 0.5,
                        transform: actions[0] && actions[1] ? 'scale(1.05)' : 'scale(1)',
                    }}
                    onClick={nextTurn}
                    disabled={!actions[0] || !actions[1]}
                >
                    ⚔️ FIGHT ⚔️
                </button>
            </div>

            {/* Battle Field */}
            <div style={styles.battleField}>
                {state.players.map((p, i) => {
                    const active = p.bench[p.activeIndex]
                    const opponent = state.players[i === 0 ? 1 : 0].bench[state.players[i === 0 ? 1 : 0].activeIndex]
                    const hpPercent = (active.currentHp / active.maxHp) * 100
                    const hpColor = hpPercent > 50 ? 'var(--theme-success)' : hpPercent > 20 ? 'var(--theme-warning)' : 'var(--theme-danger)'
                    const isReady = actions[i] !== null

                    return (
                        <div key={p.id} style={{
                            ...styles.playerCard,
                            borderColor: isReady ? 'var(--theme-success)' : 'var(--theme-border)',
                            borderWidth: isReady ? '2px' : '1px',
                        }}>
                            {/* Player Info */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, color: 'var(--theme-text)' }}>{p.name}</h3>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    background: isReady ? 'var(--theme-success)' : 'var(--theme-border)',
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold'
                                }}>
                                    {isReady ? 'READY' : 'WAITING'}
                                </span>
                            </div>

                            {/* Pokémon Display */}
                            <div style={styles.pokemonDisplay}>
                                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--theme-text)' }}>{active.pokemon.name}</span>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        {active.pokemon.types.map(t => (
                                            <span key={t} className={`type-badge type-${t.toLowerCase()}`} style={{ fontSize: '0.7rem', padding: '2px 6px' }}>{t}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={styles.spriteContainer}>
                                    <img
                                        src={active.pokemon.sprite}
                                        alt={active.pokemon.name}
                                        style={{
                                            ...styles.sprite,
                                            ...(active.fainted ? styles.faintedSprite : {})
                                        }}
                                    />
                                    {active.fainted && <div style={styles.faintedOverlay}>FAINTED</div>}
                                </div>

                                {/* HP Bar */}
                                <div style={styles.hpBarContainer}>
                                    <div style={{ ...styles.hpBarFill, width: `${hpPercent}%`, background: hpColor }}>
                                        {Math.ceil(active.currentHp)}/{active.maxHp}
                                    </div>
                                </div>
                            </div>

                            {/* Action Panel */}
                            <div style={styles.actionPanel}>
                                {active.pokemon.moves.map((m, mi) => {
                                    const eff = getTypeEffectiveness(m.type, opponent.pokemon.types)
                                    const isSelected = actions[i]?.kind === 'attack' && (actions[i] as any).moveIndex === mi

                                    return (
                                        <button
                                            key={mi}
                                            style={{
                                                ...styles.moveButton,
                                                borderColor: isSelected ? 'var(--theme-primary)' : 'var(--theme-border)',
                                                background: isSelected ? 'var(--theme-background)' : 'var(--theme-surface)',
                                                borderWidth: isSelected ? '2px' : '1px',
                                            }}
                                            onClick={() => pickAction(i, { kind: 'attack', moveIndex: mi })}
                                            disabled={active.fainted}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                                <span style={{ fontWeight: 'bold' }}>{m.name}</span>
                                                {getEffectivenessIndicator(eff)}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--theme-text-secondary)', width: '100%', textAlign: 'left' }}>
                                                {m.type} | Pow: {m.power} | Acc: {m.accuracy}%
                                            </div>
                                        </button>
                                    )
                                })}

                                {/* Utility Buttons */}
                                <button
                                    style={{ ...styles.moveButton, borderColor: actions[i]?.kind === 'dodge' ? 'var(--theme-info)' : 'var(--theme-border)' }}
                                    onClick={() => pickAction(i, { kind: 'dodge' })}
                                >
                                    💨 Dodge
                                </button>
                                <button
                                    style={{ ...styles.moveButton, borderColor: actions[i]?.kind === 'block' ? 'var(--theme-warning)' : 'var(--theme-border)' }}
                                    onClick={() => pickAction(i, { kind: 'block' })}
                                >
                                    🛡️ Block
                                </button>

                                {/* Super Move */}
                                <button
                                    style={{
                                        ...styles.superMoveButton,
                                        background: (p.superMoveGauge || 0) >= 100
                                            ? 'linear-gradient(45deg, #ff00cc, #333399)'
                                            : 'var(--theme-border)',
                                        cursor: (p.superMoveGauge || 0) >= 100 ? 'pointer' : 'not-allowed'
                                    }}
                                    disabled={(p.superMoveGauge || 0) < 100}
                                    onClick={() => pickAction(i, { kind: 'super_move' })}
                                >
                                    {(p.superMoveGauge || 0) >= 100 ? '🌟 ULTIMATE MOVE 🌟' : `⚡ Super: ${p.superMoveGauge || 0}%`}
                                </button>
                            </div>

                            {/* Bench Section */}
                            <div style={{
                                marginTop: 'var(--spacing-md)',
                                paddingTop: 'var(--spacing-md)',
                                borderTop: '1px solid var(--theme-border)'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', color: 'var(--theme-text-secondary)' }}>Bench</h4>
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {p.bench.map((b, bIdx) => {
                                        if (bIdx === p.activeIndex) return null
                                        const isSwitchTarget = actions[i]?.kind === 'switch' && (actions[i] as any).benchIndex === bIdx

                                        return (
                                            <div
                                                key={bIdx}
                                                onClick={() => {
                                                    if (!b.fainted) {
                                                        pickAction(i, { kind: 'switch', benchIndex: bIdx })
                                                    }
                                                }}
                                                style={{
                                                    width: '48px',
                                                    height: '48px',
                                                    borderRadius: '50%',
                                                    border: isSwitchTarget ? '2px solid var(--theme-primary)' : '1px solid var(--theme-border)',
                                                    background: 'var(--theme-background)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: b.fainted ? 'not-allowed' : 'pointer',
                                                    opacity: b.fainted ? 0.5 : 1,
                                                    position: 'relative',
                                                    flexShrink: 0
                                                }}
                                                title={`${b.pokemon.name} ${b.fainted ? '(Fainted)' : ''}`}
                                            >
                                                <img
                                                    src={b.pokemon.sprite}
                                                    alt={b.pokemon.name}
                                                    style={{ width: '80%', height: '80%', objectFit: 'contain', filter: b.fainted ? 'grayscale(100%)' : 'none' }}
                                                />
                                                {/* HP Dot */}
                                                <div style={{
                                                    position: 'absolute',
                                                    bottom: -2,
                                                    right: -2,
                                                    width: '12px',
                                                    height: '12px',
                                                    borderRadius: '50%',
                                                    background: b.fainted ? 'var(--theme-text-secondary)' : (b.currentHp / b.maxHp) > 0.5 ? 'var(--theme-success)' : 'var(--theme-danger)',
                                                    border: '2px solid var(--theme-surface)'
                                                }} />
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Result Modal */}
            {showResult && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>Turn Results</h2>
                        <div style={{
                            background: 'var(--theme-background)',
                            padding: 'var(--spacing-md)',
                            borderRadius: 'var(--radius-md)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            {lastLogs.map((log, idx) => (
                                <div key={idx} style={{
                                    padding: '8px',
                                    borderBottom: '1px solid var(--theme-border)',
                                    color: 'var(--theme-text)'
                                }}>
                                    {log}
                                </div>
                            ))}
                        </div>
                        <button
                            style={{ ...styles.fightButton, width: '100%', fontSize: '1.2rem' }}
                            onClick={() => setShowResult(false)}
                        >
                            Continue Battle
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
