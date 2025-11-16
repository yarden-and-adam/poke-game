import { Card, DeckState } from '../types'

function shuffle<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

export function createDeck(): DeckState {
  const cards: Card[] = []
  // Small heal x12
  for (let i = 0; i < 12; i++) {
    cards.push({ id: `heal_small_${i}`, name: 'Small Heal', description: 'Restore 30% HP', type: 'heal', value: 0.3 })
  }
  // Big heal x6
  for (let i = 0; i < 6; i++) {
    cards.push({ id: `heal_big_${i}`, name: 'Big Heal', description: 'Restore 60% HP', type: 'heal', value: 0.6 })
  }
  // Revive x6
  for (let i = 0; i < 6; i++) {
    cards.push({ id: `revive_${i}`, name: 'Revive', description: 'Revive a fainted Pokemon with 50% HP', type: 'revive', value: 0.5 })
  }
  // Shield x10
  for (let i = 0; i < 10; i++) {
    cards.push({ id: `shield_${i}`, name: 'Shield', description: 'Reduce next damage by 50%', type: 'shield', value: 0.5 })
  }
  // Boost x8
  for (let i = 0; i < 8; i++) {
    cards.push({ id: `boost_${i}`, name: 'Boost', description: 'Boost Attack for 2 turns', type: 'boost', value: 2 })
  }
  // Draw x8
  for (let i = 0; i < 8; i++) {
    cards.push({ id: `draw_${i}`, name: 'Draw', description: 'Draw one extra card', type: 'draw' })
  }
  // Evolve x10
  for (let i = 0; i < 10; i++) {
    cards.push({ id: `evolve_${i}`, name: 'Evolve', description: 'Evolve a Pokemon to its next form', type: 'evolve' })
  }

  // total: 12 + 6 + 6 + 10 + 8 + 8 + 10 = 60

  shuffle(cards)
  return { cards, discard: [] }
}

export function drawDeck(deck: DeckState, count = 1): { drawn: Card[]; deck: DeckState } {
  const drawn: Card[] = []
  let newCards = [...deck.cards]
  let newDiscard = [...deck.discard]

  for (let i = 0; i < count; i++) {
    if (newCards.length === 0) {
      // reshuffle discard
      newCards = [...newDiscard]
      newDiscard = []
      shuffle(newCards)
    }
    if (newCards.length === 0) break
    // Pop
    drawn.push(newCards.shift() as Card)
  }
  return { drawn, deck: { cards: newCards, discard: newDiscard } }
}

export function discardDeck(deck: DeckState, card: Card) {
  return { ...deck, discard: [...deck.discard, card] }
}
