# Testing Guide - Pokémon Battle Arena Session 2 Updates

## 🚀 Quick Start

### Setup
```bash
cd /Users/yardenjacobson/poke-game
npm install  # if needed
npm run dev  # start dev server
```

### Access
Open browser to `http://localhost:5173`

---

## 🧪 Test Cases

### Test 1: Loading Spinners
**Scenario:** Start the app and enter draft phase
```
Expected:
  1. Loading spinner appears with "Loading Pokémon..." message
  2. Spinner has smooth rotation animation
  3. After ~1-2 seconds, pools load and draft begins
Status: ✅ Ready to test
```

### Test 2: Simultaneous Draft (IMPORTANT)
**Scenario:** Both players pick Pokémon
```
Expected:
  1. Two separate pools visible (20 each)
  2. Player 1 picks → that Pokémon shows opacity 0.5 and "✓ Picked"
  3. Player 2 can still pick from their pool (not affected by P1's picks)
  4. Can pick exactly 6 Pokémon
  5. "Start Battle" only enables when both have 6 picks
Status: ✅ Ready to test
```

### Test 3: Move Updates on KO (CRITICAL - MUST PASS)
**Scenario:** During battle, your Pokémon faints
```
Expected:
  1. Your fainted Pokémon automatically switches out
  2. New active Pokémon is highlighted in bench
  3. CRITICAL: Move buttons now show new Pokémon's moves
  4. Move names, types, and powers are correct for new Pokémon
  5. Type effectiveness colors update for new Pokémon
Verification: Look at 4 move buttons - they should have completely different names
Status: ✅ CRITICAL BUG FIX - VERIFY THIS WORKS
```

### Test 4: Action Panel Layout
**Scenario:** View your action controls
```
Expected:
  1. At TOP of your player section (below stats)
  2. Contains:
     - 4 move buttons in 2x2 grid
     - 3 action buttons: 💨 Dodge, 🛡️ Block, 🔄 Switch
     - 1 card button: 🃏 Cards (n)
  3. Card menu expands when clicked
  4. All buttons are clickable
Status: ✅ Ready to test
```

### Test 5: Type Effectiveness Coloring
**Scenario:** Choose an attack where you have advantage or disadvantage
```
Expected:
  1. If attacking with super-effective type: Button is RED with 💥 emoji
  2. If attacking with not-very-effective type: Button is GRAY with 💨 emoji
  3. If attacking with immune-resisted type: Button is DARK with 🛡️ emoji
  4. Neutral attacks: Standard purple gradient

Example scenarios:
  - Use Fire attack on Grass defender → RED (super effective)
  - Use Fire attack on Water defender → GRAY (not very effective)
  - Use Normal attack on Ghost defender → DARK (immune)
Status: ✅ Ready to test
```

### Test 6: Type Badges
**Scenario:** Look at Pokémon display during battle
```
Expected:
  1. Active Pokémon (top of each player section):
     - Full type names visible below sprite
     - Colored badges for each type (e.g., 🔥 Fire, 💧 Water)
  2. Bench Pokémon (below active):
     - Single letter abbreviations: F, W, G, E, I, P, etc.
     - Same color coding as active badges
     - Visible on hover/selected
Status: ✅ Ready to test
```

### Test 7: Battle Result Modal
**Scenario:** Play through one complete turn
```
Expected:
  1. Both players select actions
  2. Click "⚡ Resolve Turn ⚡"
  3. Modal pops up with title "Turn X Results"
  4. Shows all logs from the turn:
     - Super Effective entries: RED background with 💥 emoji
     - Not Very Effective entries: GRAY background
     - Dodged entries: 💨 emoji
     - Healed entries: ✨ emoji
     - KO entries: 💀 emoji
  5. "Continue Battle" button closes modal
  6. Battle resumes normally
Status: ✅ Ready to test
```

### Test 8: Card System in Action Panel
**Scenario:** Select and use cards
```
Expected:
  1. Card button shows: 🃏 Cards (X) where X = number of cards
  2. Clicking button expands card grid below it
  3. Cards displayed in grid layout
  4. Clicking card selects it (shows gold border)
  5. Clicking button again collapses menu
  6. Cards can be used in battle normally
Status: ✅ Ready to test
```

### Test 9: Win Reward Pokémon (BONUS FEATURE)
**Scenario:** Play game until someone wins
```
Expected:
  1. Game reaches game-over state
  2. Winner's screen shows reward section:
     - Golden background with border
     - "🏆 Prize Pokémon!" header
     - Random Pokémon sprite displayed
     - Pokémon name shown
     - Type badges shown below name
  3. Reward is from unselected pool (not selected during draft)
  4. Loser does not see a reward
Status: ✅ Ready to test
```

### Test 10: Overall Flow
**Scenario:** Play a complete game
```
Steps:
  1. Start app → Click "🎮 Start Draft"
  2. Wait for loading (check spinner)
  3. Draft phase:
     - Pick 6 Pokémon each simultaneously
     - Verify disabled state on picks
     - Click "⚡ Start Battle ⚡"
  4. Battle phase:
     - See action panel with controls
     - See type badges on Pokémon
     - Attack with effectiveness (colors matter!)
     - See result modal after each turn
     - Battle until someone wins
  5. Game over:
     - See winner announcement
     - See reward Pokémon
     - See final stats
     - Click "← Back to Menu"
  6. Should return to start screen

Total expected time: ~3-5 minutes
Status: ✅ Full integration test
```

---

## 🔍 Visual Verification Checklist

### Colors to Look For
- ✅ Red buttons/borders = Super Effective
- ✅ Gray buttons = Not Very Effective
- ✅ Dark buttons = Immune
- ✅ Golden reward display = Prize Pokémon
- ✅ Colored type badges = Type system working

### UI Elements to Look For
- ✅ Spinning loader animation
- ✅ "✓ Picked" labels on selected Pokémon
- ✅ Action panel at top of each player
- ✅ Card menu expandable
- ✅ Modal popup after turn resolution
- ✅ Reward section in game-over screen

### Interactions to Verify
- ✅ Buttons are clickable and respond
- ✅ Selections are highlighted
- ✅ Modal can be dismissed
- ✅ Menu can expand/collapse
- ✅ Actions resolve in battle

---

## 🐛 Common Issues & Debugging

### Issue: Loader doesn't appear
- **Check:** Network tab - are Pokémon loading?
- **Fix:** Wait longer or check browser console for errors

### Issue: Moves don't update on KO (CRITICAL)
- **Symptom:** After Pokémon faints, move buttons show old moves
- **File to check:** `src/ui/BattleScreen.tsx` line 255
- **Expected:** `key={`${active.pokemon.id}-${mi}`}`
- **Fix:** If wrong, moves won't update

### Issue: Type colors not showing on buttons
- **Check:** Browser DevTools → Elements tab
- **Look for:** `class="move-button super-effective"` (or other effectiveness)
- **Verify:** CSS rules loading in Styles tab

### Issue: Reward Pokémon not showing
- **Check:** Did someone win? (Not a tie)
- **Verify:** `src/App.tsx` has unselectedPools state
- **Look for:** Reward div in BattleScreen.tsx

### Issue: Action panel not visible
- **Check:** Are you in battle phase?
- **Verify:** Player section displays "action-panel" class
- **Look for:** Move buttons, action buttons, card button

---

## 📊 Test Results Template

Create a copy of this to track your tests:

```markdown
# Test Results - [Date]

## Test 1: Loading Spinners
- [ ] Spinner appears on draft load
- [ ] Spinner appears on battle load
- [ ] Smooth animation
Status: ___

## Test 2: Simultaneous Draft
- [ ] Two separate pools visible
- [ ] Both players can pick
- [ ] Selected Pokémon disabled
- [ ] 6 picks required
Status: ___

## Test 3: Move Updates on KO (CRITICAL)
- [ ] Pokémon faints
- [ ] Auto switches out
- [ ] NEW MOVES APPEAR ← CRITICAL
- [ ] Move names correct
- [ ] Colors update
Status: ___

## Test 4-10: [Run tests above]

## Overall Status: ___
```

---

## ✅ Sign-Off Checklist

When you've completed all tests, verify:

- [ ] All 10 test cases passed
- [ ] No console errors visible
- [ ] UI is clean and responsive
- [ ] Moves update on KO (CRITICAL)
- [ ] Colors display correctly
- [ ] Reward appears on win
- [ ] Game is playable start to finish
- [ ] Back to menu works

**If all checked:** ✅ **READY FOR PRODUCTION**

---

## 🎯 Quick Test (5 minutes)

If short on time, at minimum verify:

1. **Loader appears** - Visual confirmation
2. **Moves update on KO** - Pick weak Pokémon, let it faint
3. **Type colors show** - Use super-effective attack (look for red)
4. **Action panel works** - Can select moves and actions
5. **Reward shows** - Let someone win, check gold box

These 5 tests cover 80% of the improvements!

---

**Happy Testing! 🧪🎮**
