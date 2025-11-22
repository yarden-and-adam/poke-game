export type DamageClass = 'physical' | 'special' | 'status'

export type Weather = 'clear' | 'sunny' | 'rainy' | 'stormy'

export type StatusCondition = 'burn' | 'poison' | 'sleep' | 'freeze' | 'paralyze' | null

export interface SimpleMove {
  id: number
  name: string
  type: string
  power: number | null
  accuracy: number | null
  damageClass: DamageClass
  effect?: string | null
}

export interface SimplePokemon {
  id: number
  name: string
  sprite: string
  types: string[]
  stats: {
    hp: number
    atk: number
    def: number
    spAtk: number
    spDef: number
    speed: number
  }
  moves: SimpleMove[]
  evolutions?: { name: string, condition?: string }[]
}

export interface Player {
  id: string
  name: string
  picks: SimplePokemon[]
}

export interface TypeChart {
  [typeName: string]: {
    double_from: string[]
    half_from: string[]
    zero_from: string[]
  }
}

// Game types
export interface Card {
  id: string
  name: string
  description: string
  type: 'heal' | 'revive' | 'shield' | 'boost' | 'draw' | 'evolve' | 'reinforcements' | 'type_master'
  value?: number | string
}

export interface DeckState {
  cards: Card[]
  discard: Card[]
}

export interface DeckState {
  cards: Card[]
  discard: Card[]
}

export type ActionType =
  | { kind: 'attack'; moveIndex: number }
  | { kind: 'switch'; benchIndex: number }
  | { kind: 'dodge' }
  | { kind: 'block' }
  | { kind: 'use_card'; cardId: string; targetBenchIndex?: number }
  | { kind: 'reinforcements' }
  | { kind: 'evolve'; targetPokemonName: string; benchIndex: number; cardId?: string }
  | { kind: 'super_move' }

export interface PokemonState {
  pokemon: SimplePokemon
  maxHp: number
  currentHp: number
  fainted: boolean
  shielded?: boolean
  boostedAtkTurns?: number
  status?: StatusCondition
  statusTurnsRemaining?: number
  friendship: number
  timesUsed: number
  stats: SimplePokemon['stats']
}

export interface PlayerState {
  id: string
  name: string
  bench: PokemonState[]
  pokemonPool: PokemonState[]
  activeIndex: number
  hand: Card[]
  points: number
  comboType: string | null
  comboCount: number
  superMoveGauge: number
}

export interface GameState {
  players: [PlayerState, PlayerState]
  deck: DeckState
  turnNumber: number
  weather: Weather
  weatherTurnsRemaining: number
  gameOver?: boolean
  winnerIndex?: number | null
}

export interface BattleEvent {
  type: 'critical' | 'effective' | 'block' | 'dodge' | 'heal' | 'faint' | 'weather' | 'status_damage' | 'status_apply' | 'super_move'
  message: string
  targetPlayerIndex?: number // 0 or 1
  targetPokemonIndex?: number
}
