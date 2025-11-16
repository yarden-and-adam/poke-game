# ⚡ Pokémon Battle Arena ⚡

A fun, interactive 2-player Pokémon battle game built with React, TypeScript, and Vite!

## 🎮 How to Play

### Game Overview
- **Pick Your Team**: Each player selects 6 Pokémon from a pool of 20 random Pokémon
- **Battle**: Turn-based battles where you choose your moves strategically
- **Win Condition**: First player to knock out all opponent's Pokémon wins!

### Game Mechanics

#### Pokémon Stats
- **HP**: Health points - when it reaches 0, the Pokémon faints
- **Attack**: Power of physical moves
- **Special Attack**: Power of special moves
- **Defense**: Reduces physical damage taken
- **Special Defense**: Reduces special damage taken
- **Speed**: Determines who attacks first

#### Actions Per Turn
Each turn, you can choose ONE of the following:
- **Attack**: Use one of your active Pokémon's moves
- **Dodge**: 20% chance to avoid incoming attack (higher speed = better chance)
- **Block**: Reduce incoming damage by 50%
- **Switch**: Change your active Pokémon to one from your bench

#### Move Types & Type Matchups
- **Super Effective** (💥): Move does 2x damage (water vs fire, fire vs grass, etc.)
- **Not Very Effective** (💨): Move does 0.5x damage
- **Immune** (🛡️): Move does no damage

#### Special Cards
When you knock out an opponent's Pokémon, you draw a card! Cards include:
- **Small Heal**: Restore 30% HP to a Pokémon
- **Big Heal**: Restore 60% HP to a Pokémon
- **Revive**: Bring a fainted Pokémon back with 50% HP
- **Shield**: Reduce next damage by 50%
- **Boost**: Increase attack power by 20% for 2 turns
- **Draw**: Draw an extra card

#### Scoring
- **1 Point** per opponent Pokémon knocked out
- **Tie Breaker**: Remaining HP across all Pokémon

### Strategy Tips
1. **Type Advantage**: Use type super-effectiveness to deal extra damage
2. **Speed Matters**: Faster Pokémon attack first each turn
3. **Card Economy**: Save rare cards for critical moments
4. **Team Composition**: Balance your team with different types
5. **Switching**: Switch Pokémon strategically to counter opponents

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
The app will start at `http://localhost:5173`

### Build for Production
```bash
npm build
```

## 📦 Technology Stack
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Fast build tool
- **PokeAPI v2**: Pokémon data source
- **CSS**: Modern, responsive styling

## 📁 Project Structure
```
src/
├── App.tsx              # Main app component
├── main.tsx             # Entry point
├── types.ts             # TypeScript interfaces
├── styles.css           # Global styles
├── game/
│   ├── engine.ts        # Game logic & turn resolution
│   ├── battleEngine.ts  # Damage calculations
│   └── deck.ts          # Card deck management
├── services/
│   └── pokeapi.ts       # PokeAPI integration
└── ui/
    ├── DraftScreen.tsx  # Team selection screen
    └── BattleScreen.tsx # Battle interface
```

## 🎯 Game Loop
1. **Draft Phase**: Both players pick 6 Pokémon
2. **Battle Initialization**: Deck is shuffled, each player draws 3 cards
3. **Battle Turns**: 
   - Both players select their action simultaneously
   - Actions resolve in speed order
   - If Pokémon faints, next available Pokémon is sent out
   - Winner draws a card
4. **Game End**: Battle ends when one player has no Pokémon left

## 🌟 Features
- ✅ Real Pokémon data from PokeAPI
- ✅ Type effectiveness calculations
- ✅ Speed-based turn order
- ✅ Special card system
- ✅ Beautiful, responsive UI
- ✅ Real-time battle log
- ✅ Smooth animations
- ✅ Kid-friendly design

## 🐛 Known Limitations
- Single browser-based (no network multiplayer yet)
- Limited to PokeAPI available Pokémon (gen 1-8)

## 🚀 Future Enhancements
- [ ] Network multiplayer support
- [ ] More card types
- [ ] Pokémon leveling system
- [ ] Ability system
- [ ] Status conditions (burn, poison, etc.)
- [ ] Item system
- [ ] Leaderboards

## 📝 License
Created for fun! Feel free to modify and share.

---

**Have fun battling!** 🎮⚡
