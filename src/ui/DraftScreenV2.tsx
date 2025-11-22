import React, { useEffect, useState } from 'react'
import { SimplePokemon, Player } from '../types'
import { fetchRandomPokemonPool } from '../services/pokeapi'

// --- Styles (Scoped) ---
const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'var(--spacing-md)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--spacing-lg)',
    },
    header: {
        textAlign: 'center' as const,
        marginBottom: 'var(--spacing-md)',
    },
    title: {
        fontSize: '2rem',
        fontWeight: '800',
        color: 'var(--theme-text)',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)',
        margin: 0,
    },
    subtitle: {
        color: 'var(--theme-text-secondary)',
        marginTop: '8px',
    },
    draftGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--spacing-xl)',
        alignItems: 'start',
    },
    playerColumn: {
        background: 'var(--theme-surface)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--theme-border)',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 'var(--spacing-md)',
    },
    playerHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 'var(--spacing-sm)',
    },
    playerNameInput: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        padding: '8px 12px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--theme-border)',
        background: 'var(--theme-background)',
        color: 'var(--theme-text)',
        width: '60%',
    },
    counter: {
        padding: '4px 12px',
        borderRadius: '12px',
        fontWeight: 'bold',
        fontSize: '0.9rem',
    },
    sectionTitle: {
        fontSize: '0.9rem',
        textTransform: 'uppercase' as const,
        letterSpacing: '1px',
        color: 'var(--theme-text-secondary)',
        marginBottom: '8px',
        fontWeight: 'bold',
    },
    squadGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        marginBottom: 'var(--spacing-lg)',
        minHeight: '160px', // Reserve space
    },
    poolGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
    },
    card: {
        background: 'var(--theme-background)',
        border: '1px solid var(--theme-border)',
        borderRadius: 'var(--radius-md)',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative' as const,
        aspectRatio: '1 / 1.2',
    },
    cardSelected: {
        borderColor: 'var(--theme-primary)',
        boxShadow: '0 0 0 2px var(--theme-primary)',
        transform: 'scale(0.95)',
        opacity: 0.8,
    },
    cardImage: {
        width: '80%',
        height: '80%',
        objectFit: 'contain' as const,
        marginBottom: '4px',
    },
    cardName: {
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: 'var(--theme-text)',
        textAlign: 'center' as const,
        whiteSpace: 'nowrap' as const,
        overflow: 'hidden' as const,
        textOverflow: 'ellipsis' as const,
        width: '100%',
    },
    startButton: {
        gridColumn: '1 / -1',
        padding: '16px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        borderRadius: 'var(--radius-full)',
        background: 'linear-gradient(135deg, var(--theme-warning), #f59e0b)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-lg)',
        marginTop: 'var(--spacing-lg)',
        textTransform: 'uppercase' as const,
        letterSpacing: '2px',
        transition: 'transform 0.2s',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        color: 'var(--theme-text)',
    }
}

interface DraftScreenProps {
    onComplete: (p1: Player, p2: Player, unselectedPool1: SimplePokemon[], unselectedPool2: SimplePokemon[]) => void
}

export default function DraftScreenV2({ onComplete }: DraftScreenProps) {
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
            // Check if already picked
            if (result[playerIdx].picks.some(p => p.id === pokemon.id)) return result

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

    function handleStart() {
        // Calculate unselected pools
        const unselected1 = pools[0].filter(p => !isPicked(0, p.id))
        const unselected2 = pools[1].filter(p => !isPicked(1, p.id))
        onComplete(players[0], players[1], unselected1, unselected2)
    }

    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div className="pokeball-loader">
                    <div className="pokeball">
                        <div className="pokeball-top"></div>
                        <div className="pokeball-middle"></div>
                        <div className="pokeball-bottom"></div>
                        <div className="pokeball-button"></div>
                    </div>
                </div>
                <h2 style={{ marginTop: '20px' }}>Loading Pokémon...</h2>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>⚔️ Draft Your Team</h1>
                <p style={styles.subtitle}>Select 6 Pokémon for each player</p>
            </div>

            <div style={styles.draftGrid}>
                {players.map((player, playerIdx) => {
                    const isComplete = player.picks.length === 6
                    const currentPool = pools[playerIdx]

                    return (
                        <div key={player.id} style={styles.playerColumn}>
                            {/* Player Header */}
                            <div style={styles.playerHeader}>
                                <input
                                    type="text"
                                    value={playerIdx === 0 ? player1Name : player2Name}
                                    onChange={e => playerIdx === 0 ? setPlayer1Name(e.target.value) : setPlayer2Name(e.target.value)}
                                    style={styles.playerNameInput}
                                />
                                <span style={{
                                    ...styles.counter,
                                    background: isComplete ? 'var(--theme-success)' : 'var(--theme-border)',
                                    color: isComplete ? 'white' : 'var(--theme-text-secondary)'
                                }}>
                                    {player.picks.length}/6 Ready
                                </span>
                            </div>

                            {/* Squad Section */}
                            <div>
                                <div style={styles.sectionTitle}>Your Squad</div>
                                <div style={styles.squadGrid}>
                                    {player.picks.map(p => (
                                        <div
                                            key={p.id}
                                            style={{ ...styles.card, borderColor: 'var(--theme-success)' }}
                                            onClick={() => unpickPokemon(playerIdx, p.id)}
                                            title="Click to remove"
                                        >
                                            <img src={p.sprite} alt={p.name} style={styles.cardImage} />
                                            <div style={styles.cardName}>{p.name}</div>
                                        </div>
                                    ))}
                                    {/* Empty Slots */}
                                    {Array.from({ length: 6 - player.picks.length }).map((_, i) => (
                                        <div key={`empty-${i}`} style={{
                                            ...styles.card,
                                            borderStyle: 'dashed',
                                            opacity: 0.5,
                                            justifyContent: 'center'
                                        }}>
                                            <span style={{ fontSize: '2rem', color: 'var(--theme-border)' }}>+</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Pool Section */}
                            <div>
                                <div style={styles.sectionTitle}>Available Recruits</div>
                                <div style={styles.poolGrid}>
                                    {currentPool.map(p => {
                                        const picked = isPicked(playerIdx, p.id)
                                        if (picked) return null // Hide picked ones from pool to reduce clutter? Or show disabled?
                                        // Let's hide them to make it cleaner as per "V2" goal

                                        return (
                                            <div
                                                key={p.id}
                                                style={styles.card}
                                                onClick={() => pickPokemon(playerIdx, p)}
                                            >
                                                <img src={p.sprite} alt={p.name} style={styles.cardImage} />
                                                <div style={styles.cardName}>{p.name}</div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )
                })}

                {/* Start Button */}
                {players[0].picks.length === 6 && players[1].picks.length === 6 && (
                    <button
                        style={styles.startButton}
                        onClick={handleStart}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        ⚡ Start Battle ⚡
                    </button>
                )}
            </div>
        </div>
    )
}
