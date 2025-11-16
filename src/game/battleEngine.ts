import { SimplePokemon, SimpleMove, TypeChart } from '../types'

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
  const modifier = stab * typeEff * crit * randF
  const dmg = Math.max(1, Math.floor(base * modifier))
  return { damage: dmg, details: { stab, typeEff, crit, randF } }
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
