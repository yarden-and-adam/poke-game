import { Player, PlayerState, GameState, ActionType, PokemonState, TypeChart } from '../types'
import { createDeck, drawDeck } from './deck'
import { calculateDamage, accuracyCheck, dodgeCheck, blockDamage } from './battleEngine'
import { fetchPokemonByNameOrId } from '../services/pokeapi'

export function buildGameState(
  player1: Player,
  player2: Player,
  unselectedPool1: SimplePokemon[],
  unselectedPool2: SimplePokemon[]
): GameState {
  const deck = createDeck()
  // initialize players as PlayerState
  const p1State: PlayerState = {
    id: player1.id,
    name: player1.name,
    bench: player1.picks.map(p => ({
      pokemon: p,
      maxHp: p.stats.hp * 2,
      currentHp: p.stats.hp * 2,
      fainted: false,
      shielded: false,
      boostedAtkTurns: 0,
    })),
    pokemonPool: unselectedPool1.map(p => ({
      pokemon: p,
      maxHp: p.stats.hp * 2,
      currentHp: p.stats.hp * 2,
      fainted: false,
      shielded: false,
      boostedAtkTurns: 0,
    })),
    activeIndex: 0,
    hand: [],
    points: 0,
  }
  const p2State: PlayerState = {
    id: player2.id,
    name: player2.name,
    bench: player2.picks.map(p => ({
      pokemon: p,
      maxHp: p.stats.hp * 2,
      currentHp: p.stats.hp * 2,
      fainted: false,
      shielded: false,
      boostedAtkTurns: 0,
    })),
    pokemonPool: unselectedPool2.map(p => ({
      pokemon: p,
      maxHp: p.stats.hp * 2,
      currentHp: p.stats.hp * 2,
      fainted: false,
      shielded: false,
      boostedAtkTurns: 0,
    })),
    activeIndex: 0,
    hand: [],
    points: 0,
  }

  // draw initial hands
  const r1 = drawDeck(deck, 3)
  deck.cards = r1.deck.cards
  deck.discard = r1.deck.discard
  p1State.hand = r1.drawn
  const r2 = drawDeck(deck, 3)
  deck.cards = r2.deck.cards
  deck.discard = r2.deck.discard
  p2State.hand = r2.drawn

  return {
    players: [p1State, p2State],
    deck,
    turnNumber: 1,
  }
}

export async function resolveTurn(
  state: GameState,
  actions: [ActionType | null, ActionType | null],
  typeChart: TypeChart
): Promise<{ newState: GameState; logs: string[] }> {
  const logs: string[] = []
  // deep copy
  const s: GameState = JSON.parse(JSON.stringify(state))

  const [act0, act1] = actions
  // hold flags
  const justSwitched = [false, false]
  const usedShield = [false, false]

  // Helper functions
  const getActive = (pIdx: number) => s.players[pIdx].bench[s.players[pIdx].activeIndex]

  // 1. Handle switches and card usage first
  for (let i = 0; i < 2; i++) {
    const action = actions[i]
    if (!action) continue
    if (action.kind === 'switch') {
      const target = (action as any).benchIndex
      if (target < 0 || target >= s.players[i].bench.length) {
        logs.push(`${s.players[i].name} tried to switch to invalid slot`)
      } else if (s.players[i].bench[target].fainted) {
        logs.push(`${s.players[i].name} tried to switch to a fainted Pokemon`)
      } else {
        s.players[i].activeIndex = target
        justSwitched[i] = true
        logs.push(`${s.players[i].name} swapped to ${s.players[i].bench[target].pokemon.name}`)
      }
    } else if (action.kind === 'use_card') {
      const cardId = (action as any).cardId
      const cardIdx = s.players[i].hand.findIndex(c => c.id === cardId)
      if (cardIdx === -1) {
        logs.push(`${s.players[i].name} tried to use a missing card`)
      } else {
        const card = s.players[i].hand.splice(cardIdx, 1)[0]
        // apply effect default to active slot
        const targetIndex = (action as any).targetBenchIndex ?? s.players[i].activeIndex
        const target = s.players[i].bench[targetIndex]
        switch (card.type) {
          case 'heal': {
            const heal = Math.max(1, Math.floor(target.maxHp * (card.value || 0.3)))
            target.currentHp = Math.min(target.maxHp, target.currentHp + heal)
            logs.push(`${s.players[i].name} used ${card.name} on ${target.pokemon.name} healed ${heal}`)
            break
          }
          case 'revive': {
            if (target.fainted) {
              target.fainted = false
              target.currentHp = Math.max(1, Math.floor(target.maxHp * (card.value || 0.5)))
              logs.push(`${s.players[i].name} revived ${target.pokemon.name}`)
            } else logs.push(`${card.name} failed: target wasn't fainted`)
            break
          }
          case 'shield': {
            target.shielded = true
            usedShield[i] = true
            logs.push(`${s.players[i].name} used ${card.name} on ${target.pokemon.name}`)
            break
          }
          case 'boost': {
            target.boostedAtkTurns = (target.boostedAtkTurns || 0) + (card.value || 2)
            logs.push(`${s.players[i].name} used ${card.name} on ${target.pokemon.name}`)
            break
          }
          case 'draw': {
            const drawn = drawDeck(s.deck, card.value || 1)
            s.deck = drawn.deck
            s.players[i].hand = [...s.players[i].hand, ...drawn.drawn]
            logs.push(`${s.players[i].name} used ${card.name} and drew ${drawn.drawn.length} cards`)
            break
          }
          case 'evolve': {
            // This case will be handled by the direct 'evolve' action, not a card
            logs.push(`${card.name} card is no longer supported.`)
            break
          }
          case 'reinforcements': {
            // This case will be handled by the direct 'reinforcements' action, not a card
            logs.push(`${card.name} card is no longer supported.`)
            break
          }
        }
        // discard the used card
        s.deck.discard.push(card)
      }
    } else if (action.kind === 'reinforcements') {
      const player = s.players[i]
      const availableFromPool = player.pokemonPool
      if (availableFromPool.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableFromPool.length)
        const newPokemon = availableFromPool.splice(randomIndex, 1)[0]
        player.bench.push({ ...newPokemon, currentHp: newPokemon.maxHp, fainted: false })
        logs.push(`${player.name} used Reinforcements and got a new Pokémon: ${newPokemon.pokemon.name}!`)
      } else {
        logs.push('No Pokémon available in the pool.')
      }
    } else if (action.kind === 'evolve') {
      const targetPokemonName = (action as any).targetPokemonName
      const benchIndex = (action as any).benchIndex
      const currentPokemonState = s.players[i].bench[benchIndex]

      if (!currentPokemonState) {
        logs.push(`${s.players[i].name} tried to evolve a non-existent Pokémon.`)
        continue
      }

      const evolvedPokemon = await fetchPokemonByNameOrId(targetPokemonName)
      if (evolvedPokemon) {
        const newPokemonState: PokemonState = {
          pokemon: evolvedPokemon,
          maxHp: evolvedPokemon.stats.hp * 2,
          currentHp: currentPokemonState.currentHp, // Keep current HP
          fainted: currentPokemonState.fainted,
          shielded: currentPokemonState.shielded,
          boostedAtkTurns: currentPokemonState.boostedAtkTurns,
        }
        s.players[i].bench[benchIndex] = newPokemonState
        logs.push(`${currentPokemonState.pokemon.name} evolved into ${evolvedPokemon.name}!`)
      } else {
        logs.push(`Evolution failed for ${currentPokemonState.pokemon.name}.`)
      }
    } else if (action.kind === 'block') {
      // make a flag on the pokemon
      const active = getActive(i)
      active.shielded = true
      logs.push(`${s.players[i].name} used Block`)
    } else if (action.kind === 'dodge') {
      logs.push(`${s.players[i].name} used Dodge`) // effect will be evaluated when attacked
    }
  }

  // 2. Attack resolution: gather attack orders
  type AttackOrder = { pIdx: number; moveIndex: number }
  const orders: AttackOrder[] = []
  for (let i = 0; i < 2; i++) {
    const action = actions[i]
    if (!action) continue
    if (action.kind === 'attack') {
      orders.push({ pIdx: i, moveIndex: action.moveIndex })
    }
  }

  // Sort by speed
  orders.sort((a, b) => {
    const speedA = s.players[a.pIdx].bench[s.players[a.pIdx].activeIndex].pokemon.stats.speed
    const speedB = s.players[b.pIdx].bench[s.players[b.pIdx].activeIndex].pokemon.stats.speed
    if (speedA === speedB) return Math.random() > 0.5 ? 1 : -1
    return speedB - speedA
  })

  for (const ord of orders) {
    const attackerPlayer = s.players[ord.pIdx]
    const defenderPlayer = s.players[ord.pIdx === 0 ? 1 : 0]
    const attacker = attackerPlayer.bench[attackerPlayer.activeIndex]
    const defender = defenderPlayer.bench[defenderPlayer.activeIndex]

    // skip if attacker fainted or just switched
    if (attacker.fainted) {
      logs.push(`${attacker.pokemon.name} cannot attack (fainted)`) 
      continue
    }
    if (justSwitched[ord.pIdx]) {
      logs.push(`${attacker.pokemon.name} just switched in and can't attack this turn`)
      continue
    }

    const move = attacker.pokemon.moves[ord.moveIndex]
    if (!move) {
      logs.push(`${attackerPlayer.name} tried to use an invalid move`) 
      continue
    }

    if (!accuracyCheck(move)) {
      logs.push(`${attacker.pokemon.name} tried to use ${move.name} but missed!`)
      continue
    }

    // Shade dodge: if defender had 'dodge' action
    const defenderAction = actions[ord.pIdx === 0 ? 1 : 0]
    if (defenderAction && defenderAction.kind === 'dodge') {
      if (dodgeCheck(attacker.pokemon, defender.pokemon)) {
        logs.push(`${defender.pokemon.name} dodged ${move.name} from ${attacker.pokemon.name}`)
        continue
      }
    }

    let dmgData = calculateDamage(attacker.pokemon, defender.pokemon, move, typeChart)
    let dmg = dmgData.damage
    // apply boosted atk (if any) as +20% per boost turn
    if ((attacker.boostedAtkTurns || 0) > 0) dmg = Math.floor(dmg * 1.2)

    // apply defender shield
    if (defender.shielded) {
      dmg = Math.max(1, Math.floor(dmg * 0.5))
      defender.shielded = false
    }

    // apply block action if defender used block
    if (defenderAction && defenderAction.kind === 'block') {
      dmg = Math.max(1, Math.floor(dmg * 0.5))
    }

    defender.currentHp = Math.max(0, defender.currentHp - dmg)
    logs.push(`${attacker.pokemon.name} used ${move.name} on ${defender.pokemon.name} dealing ${dmg} (HP left ${defender.currentHp}/${defender.maxHp})`)

    if (defender.currentHp <= 0 && !defender.fainted) {
      defender.fainted = true
      logs.push(`${defender.pokemon.name} fainted!`)
      // award point
      attackerPlayer.points = (attackerPlayer.points || 0) + 1
      // draw a card for attacker
      const drawn = drawDeck(s.deck, 1)
      s.deck = drawn.deck
      s.players[ord.pIdx].hand.push(...drawn.drawn)
      if (drawn.drawn.length > 0) {
        logs.push(`${attackerPlayer.name} drew a card for knocking out ${defender.pokemon.name}`)
      }
    }
  }

  // Auto-switch fainted active Pokémon
  for (let i = 0; i < 2; i++) {
    const active = s.players[i].bench[s.players[i].activeIndex]
    if (active.fainted) {
      const nextAvailable = s.players[i].bench.findIndex((pk, idx) => idx !== s.players[i].activeIndex && !pk.fainted)
      if (nextAvailable !== -1) {
        s.players[i].activeIndex = nextAvailable
        logs.push(`${s.players[i].name}'s ${s.players[i].bench[nextAvailable].pokemon.name} is sent out!`)
      }
    }
  }

  // After attacks, check for game end: if a player's all Pokemon fainted -> game over
  for (let i = 0; i < 2; i++) {
    const allFainted = s.players[i].bench.every(b => b.fainted)
    if (allFainted) {
      s.gameOver = true
      // winner is the other player or compare points
      const other = i === 0 ? 1 : 0
      if (s.players[other].points !== s.players[i].points) {
        s.winnerIndex = s.players[other].points > s.players[i].points ? other : i
      } else {
        // tie-breaker: total remaining HP
        const hp0 = s.players[0].bench.reduce((acc, b) => acc + (b.fainted ? 0 : b.currentHp), 0)
        const hp1 = s.players[1].bench.reduce((acc, b) => acc + (b.fainted ? 0 : b.currentHp), 0)
        if (hp0 === hp1) s.winnerIndex = null
        else s.winnerIndex = hp0 > hp1 ? 0 : 1
      }
      logs.push(`Game Over: ${s.players[s.winnerIndex ?? 0].name} wins!`)
    }
  }

  // cleanup: decrement boosted turns and clear shields flags consumed
  for (let i = 0; i < 2; i++) {
    for (const pk of s.players[i].bench) {
      if (pk.boostedAtkTurns && pk.boostedAtkTurns > 0) pk.boostedAtkTurns -= 1
    }
  }

  s.turnNumber += 1
  return { newState: s, logs }
}
