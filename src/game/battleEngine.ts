import { SimplePokemon, SimpleMove, TypeChart, Weather, StatusCondition } from '../types'

function getTypeMultiplier(attackType: string, defenderTypes: string[], typeChart: TypeChart) {
  let multiplier = 1
  for (const dt of defenderTypes) {
    const tc = typeChart[dt]
    if (!tc) continue
    if (tc.zero_from.includes(attackType)) return 0
    if (tc.double_from.includes(attackType)) multiplier *= 2
    if (tc.half_from.includes(attackType)) multiplier *= 0.5
  }
  return multiplier
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export function calculateDamage(
  attacker: SimplePokemon,
  defender: SimplePokemon,
  move: SimpleMove,
  typeChart: TypeChart,
  weather: Weather = 'clear',
  defenderStatus: StatusCondition = null,
  level = 50
) {
  const power = move.power || 0
  const isPhysical = move.damageClass === 'physical'
  const atk = isPhysical ? attacker.stats.atk : attacker.stats.spAtk
  const def = isPhysical ? defender.stats.def : defender.stats.spDef

  // base damage
  const base = Math.floor(((2 * level) / 5 + 2) * power * (atk / def) / 50 + 2)
  // STAB
  const stab = attacker.types.includes(move.type) ? 1.5 : 1
  // type effectiveness
  const typeEff = getTypeMultiplier(move.type, defender.types, typeChart)
  // critical chance (simple)
  const crit = Math.random() < 0.0625 ? 1.5 : 1
  const randF = rand(0.85, 1)

  // Weather modifiers
  let weatherMod = 1
  if (weather === 'sunny') {
    if (move.type === 'fire') weatherMod = 1.2
    if (move.type === 'water') weatherMod = 0.8
  } else if (weather === 'rainy') {
    if (move.type === 'water') weatherMod = 1.2
    if (move.type === 'fire') weatherMod = 0.8
  } else if (weather === 'stormy') {
    if (move.type === 'electric') weatherMod = 1.3
  }

  const modifier = stab * typeEff * crit * randF * weatherMod
  const dmg = Math.max(1, Math.floor(base * modifier))
  const isCritical = crit > 1

  // Status Application Logic
  let appliedStatus: StatusCondition = null
  if (!defenderStatus) {
    const randStatus = Math.random()
    if (move.type === 'fire' && randStatus < 0.1) appliedStatus = 'burn'
    else if (move.type === 'electric' && randStatus < 0.1) appliedStatus = 'paralyze'
    else if (move.type === 'ice' && randStatus < 0.1) appliedStatus = 'freeze'
    else if (move.type === 'poison' && randStatus < 0.1) appliedStatus = 'poison'
    else if (move.type === 'psychic' && randStatus < 0.05) appliedStatus = 'sleep'
  }

  return { damage: dmg, details: { stab, typeEff, crit, randF, weatherMod, isCritical }, appliedStatus }
}

export function checkStatusEffects(pokemon: SimplePokemon, status: StatusCondition): { canMove: boolean, message?: string } {
  if (!status) return { canMove: true }

  if (status === 'freeze') {
    if (Math.random() < 0.2) return { canMove: true, message: `${pokemon.name} thawed out!` }
    return { canMove: false, message: `${pokemon.name} is frozen solid!` }
  }
  if (status === 'sleep') {
    if (Math.random() < 0.33) return { canMove: true, message: `${pokemon.name} woke up!` }
    return { canMove: false, message: `${pokemon.name} is fast asleep.` }
  }
  if (status === 'paralyze') {
    if (Math.random() < 0.25) return { canMove: false, message: `${pokemon.name} is paralyzed! It can't move!` }
  }
  return { canMove: true }
}

export function getStatusDamage(pokemon: SimplePokemon, status: StatusCondition, maxHp: number): { damage: number, message?: string } {
  if (status === 'burn') {
    const dmg = Math.floor(maxHp * 0.0625)
    return { damage: Math.max(1, dmg), message: `${pokemon.name} is hurt by its burn!` }
  }
  if (status === 'poison') {
    const dmg = Math.floor(maxHp * 0.125)
    return { damage: Math.max(1, dmg), message: `${pokemon.name} is hurt by poison!` }
  }
  return { damage: 0 }
}

export function accuracyCheck(move: SimpleMove) {
  if (!move.accuracy) return true
  return Math.random() * 100 <= (move.accuracy || 100)
}

export function dodgeCheck(attacker: SimplePokemon, defender: SimplePokemon) {
  const base = 0.2
  const speedFactor = Math.max(-0.15, Math.min(0.15, (defender.stats.speed - attacker.stats.speed) / 100))
  const chance = base + speedFactor
  return Math.random() < chance
}

export function blockDamage(damage: number, percent = 0.5) {
  return Math.max(1, Math.floor(damage * (1 - percent)))
}
