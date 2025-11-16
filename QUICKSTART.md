# 🎮 Quick Start Guide

## Installation (One-time setup)

```bash
cd /Users/yardenjacobson/poke-game
npm install
```

## Running the Game

```bash
npm run dev
```

Open your browser to: **http://localhost:5173**

## Game Flow

### 1️⃣ Main Menu
- Click **"🎮 Start Draft"** to begin
- Click **"❓ How to Play"** for rules

### 2️⃣ Draft Phase
- Players alternate picking Pokémon
- Click "Pick" button on Pokémon you want
- Need 6 Pokémon per player
- Click **"⚡ Start Battle ⚡"** when ready

### 3️⃣ Battle Phase
Each turn, select ONE action:

**Attack** 🔥
- Click a move button
- Emojis show type effectiveness:
  - 💥 = Super Effective (2x damage)
  - 💨 = Not Very Effective (0.5x)
  - 🛡️ = Immune (no damage)

**Dodge** 💨
- 20% chance to avoid damage
- Higher speed = better chance

**Block** 🛡️
- Reduce next damage by 50%

**Switch** 🔄
- Change to a different Pokémon
- Can't switch to fainted ones

**Cards** 🃏
- Click a card to use it
- Cards are gained by knocking out opponent's Pokémon

### 4️⃣ Winning
- First to knock out all opponent's Pokémon wins!
- Each KO = 1 Point
- Draw a card when you get a KO

---

## 💡 Pro Tips

1. **Type Advantages Matter**
   - Water beats Fire
   - Fire beats Grass
   - Grass beats Water
   - Look for the 💥 emoji for super effective moves!

2. **Speed Matters**
   - Faster Pokémon attack first each turn
   - Use this to your advantage

3. **Team Composition**
   - Pick variety of types
   - Balance high offense with durability
   - Have a strategy for each matchup

4. **Card Strategy**
   - Save heals for important moments
   - Use revives to get back in the game
   - Boosts help you secure KOs

5. **Switching**
   - Switch to counter opponent's type
   - Don't waste a turn if you're winning

---

## Keyboard Shortcuts
(Coming soon in future updates)

---

## Troubleshooting

**"Pokémon won't load"**
- Check your internet connection
- Refresh the page

**"Game feels slow"**
- This is normal on first load (fetching data)
- Subsequent games will be faster

**"Button didn't register"**
- Both players must select an action
- Green checkmark shows you're ready

---

## Have Fun! 🎉

Remember: It's all about strategy and type matchups!

Questions? Check the full README.md file.
