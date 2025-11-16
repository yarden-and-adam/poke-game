# Pokémon Battle Web App — Developer Plan

Date: 2025-11-15

Purpose
- Create a 2-player, turn-based Pokémon-style battle web app (client-only after initial data load) using PokeAPI.
- MVP: Draft 6 Pokémon each from a pool of 20, battle, use moves, dodge/block, score points on KOs, and draw cards from a 50-card deck.

High-level summary (MVP)
- Two players pick 6 Pokémon each out of a randomly generated pool of 20 Pokémon.
- Each Pokémon has picture, max HP, current HP, types, base stats (atk, def, spAtk, spDef, speed), and up to 3–4 moves.
- The match starts with a coin toss to pick the starting player.
- Simultaneous action selection: both players pick the active Pokémon and an action (attack/switch/use-card/dodge/block); actions resolve by Pokémon speed.
- Damage is calculated with a simplified Pokémon damage formula; includes STAB, type effectiveness (full type coverage), variance, and accuracy.
- Players can dodge or block to mitigate or avoid damage.
- KO grants 1 point to the KO-ing player and 1 random card drawn from the 50-card deck.
- Game ends when a player has no Pokémon left; winner = player with most points.

Platform & Tech Stack Recommendations
- Web (client-only after initial data fetch)
- Framework: React + TypeScript + Vite
- UI: TailwindCSS (or CSS modules) for fast prototyping
- Optional: React Query for caching/fetching PokeAPI resources; localStorage caching for prefetch results to avoid API rate limits
- Testing: Jest for unit tests; vitest or React Testing Library for components

Data Model (simplified)
- GameState: id, players[2], deck, discardPile, turnNumber, coinFlipResult, currentPhase, battleLog
- Player: id, name, bench[6], activePokemonIndex, hand(cards[]), points
- Pokemon: id, name, sprite, maxHP, currentHP, types[], stats{hp, atk, def, spAtk, spDef, speed}, moves[3], isFainted
- Move: id, name, type, damage_class (physical/special/status), power, accuracy, effect
- Card: id, name, description, type, effect (function), rarity
- Deck: array[50] (shuffled), draw() method, reshuffle when needed

PokeAPI usage & caching
- Endpoints: /api/v2/pokemon/{id}, /api/v2/move/{id}, /api/v2/type/{id}
- Workflow:
  1. Fetch 20 random pokemon IDs using a random generator within available PokeAPI range.
  2. For each Pokemon, fetch /pokemon/{id} -> picks sprites, types, stats, and moves list.
  3. From each Pokemon's moves list, pick 3 moves: prefer damage moves (power > 0 and damage_class = physical/special). Fetch details with /move/{id}.
  4. Build a simplified Pokemon object for in-app usage.
  5. Build a type-effectiveness chart from /type/{id} relations, store as a map for runtime lookups.
- Cache results in localStorage (e.g., `pokedex_cache`) to skip repeat API calls. Also maintain a TTL (e.g., 6–24 hrs).

Game Mechanics & Rules
- Drafting:
  - Create a pool of 20 unique random Pokemon.
  - Players alternate picking Pokemon until both have 6.
  - Option: allow auto-pick for quick start.
- Turn & actions:
  - Both players select actions simultaneously (attack, switch, use-card, dodge, block).
  - Actions are locked and resolved by Pokemon speed. If tie -> coin flip.
  - Switches happen instantly but do not cause contact damage unless implementing abilities; however, switching could change the first attack target due to speed.
- Damage calculation:
  - Use simplified formula: damage = floor((((2*Level)/5 + 2) * Power * (Atk/Def) / 50 + 2) * Modifier)
  - Level = constant (50). Use Attack/Defense for physical; SpAtk/SpDef for special.
  - Modifier = STAB(1.5 if move type matches attacker type) * TypeEffectiveness * Critical * Random(0.85–1) * OtherModifiers.
  - Accuracy check occurs before damage; if move misses, no damage is applied.
  - TypeEffectiveness: use type chart (x0, x0.25, x0.5, x1, x2, x4 as needed).
- Dodge / Block:
  - Dodge: attempts to evade an incoming attack — success chance base 20% + (attackerSpeed - defenderSpeed)/something; implement a function that makes sense and is balanced.
  - Block: reduces the incoming damage by a flat percentage (e.g., 50%). Block might not protect from status effects.
- Knockouts, scoring & cards:
  - When a Pokemon hits 0 HP it faints -> mark as fainted, remove from active slot to the bench.
  - Attacker gets 1 point and draws 1 random card from deck if available.
  - Hand size: maybe no limit but limit 1 card per turn to avoid spam.
  - Cards: 50 card deck; on-deck draw when a KO occurs, discard pile reshuffle if deck is empty.
- End game:
  - Game ends when one player's bench is empty (all 6 fainted).
  - Determine winner by points; tie-breakers: remaining total HP or sudden-death rounds.

Deck & Card Ideas
- Heal (small & large), Revive (revive fainted Pokemon to partial HP), Shield (reduce next hit by X%), Swap (force swap or switch), Stat Boost (+Atk/SpAtk), Draw Extra, Extra Attack / Double Damage, Remove Status.
- Balance: cards should be powerful but limited by draw frequency and per-turn usage.

UI / UX
- Draft Screen: show 20 Pokemon cards, player images, and counters. Support click to pick/draft.
- Battle Screen: split-screen with both player's benches, active Pokemon in the middle, move buttons, card hand, and action log.
- Controls should be big and clear for Adam (kid).
- Provide helpful tooltips for move effects and card usage.
- Accessibility consider large fonts & color contrast.

Architecture & Components
- App (routing & state provider)
- services/pokeApiService.ts (fetch & cache), typeChartService.ts
- stores/gameStore.ts (global state + battleEngine)
- UI: StartScreen, DraftScreen, BattleScreen, PokemonCard, MoveList, CardHand, DeckView, ActionLog.
- battleEngine.ts: core logic for action resolution, damage calc, status, KO, card logic.

Testing & QA
- Unit tests for: damage calculation, STAB and type effect, accuracy, dodge & block probabilities, card functions, deck shuffle.
- Integration tests for: draft flow, battle flow, KO & scoring, game end conditions.
- Automatic mock of PokeAPI for tests to avoid rate limiting.

Performance & Rate Limit Considerations
- PokeAPI is rate limited; cache fetched data in localStorage and use a simple queue for fetching during the initial random 20 load.
- Consider bundling a small local JSON dataset for offline dev/testing.

Roadmap & Sprint Plan (8 sprints; MVP-focused)
- Sprint 0: Repo setup, TypeScript React Vite, Tailwind.
- Sprint 1: PokeAPI loader, fetch 20 random Pokemon, build simplified Pokemon objects, caching.
- Sprint 2: Draft screen UI and alternating picks (drag/drop or click), persist teams to game state.
- Sprint 3: Battle UI & coin flip; display active Pokemon and moves.
- Sprint 4: Implement battle engine core: damage formula, STAB, type effectiveness, order by speed.
- Sprint 5: Dodge/Block mechanics, switching logic, KO handling, scoreboard.
- Sprint 6: Cards, deck shuffle, card effects and draw-on-KO.
- Sprint 7: UX polish, animations, sounds, UI for kids.
- Sprint 8: Testing, balancing, bug fixes, and documenting gameplay.

Acceptance Criteria for MVP
- Player can draft 6 Pokémon from a 20-pool.
- Players see sprites, types, and 3 moves.
- The game performs coin toss, allows action selection, resolves moves by speed, handles type-based damage.
- Dodge and block functionality works.
- KO awards points and card draws; deck works with 50 cards.
- Game ends when a player's bench is empty; winner calculated by points.

Development tasks (dev-to-do)
- Setup project scaffolding and dependencies
- Implement PokeAPI fetch utilities & caching
- Draft UI & data model
- Battle UI & engine
- Card & deck implementation
- Unit tests for battle computations
- Polish & parental control UI

Notes & Constraints
- Make numbers kid-friendly (higher HP & simpler move powers) for fun games and fast rounds.
- Keep data fetch to a minimum to avoid API rate limits; caching is important.
- Keep code modular: separate UI from game logic so you can test engine independently.

Next Steps
1. Agree on tech stack (React + TypeScript + Vite recommended).
2. Initialize project and commit README + this plan.
3. Implement Sprint 0 (repo initialization and PokeAPI fetch utilities).

Contact & References
- PokeAPI (https://pokeapi.co/) docs for Pokemon, move, and type endpoints.
- This plan will guide implementation and provide acceptance criteria for MVP.
