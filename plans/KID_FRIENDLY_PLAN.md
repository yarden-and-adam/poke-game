# Pokémon Battle Web App — Kid-Friendly Plan

Hello Adam (and grown-ups)! We're going to build a fun Pokémon battle game you can play on a web browser. Here’s a simple plan we can understand and follow!

Goal
- Make a 2-player Pokémon game. You and a friend (or grown-up) will pick teams and battle.
- The game will be simple and fun: pick Pokémon, pick moves, try to knock out opponent Pokémon, use special cards, and score points.

How the game works (short version)
- Each player picks 6 Pokémon from a group of 20 random Pokémon. The Pokémon have pictures, health, types (like water, fire), and moves (attacks).
- We flip a virtual coin to see who goes first.
- Each turn, both players choose a move for their Pokémon and may also swap Pokémon or use a card.
- Moves do damage based on the Pokémon’s power and type (water is strong against fire, etc.).
- You can try to dodge or block an attack to avoid or reduce damage.
- If a Pokémon faint (their health goes to zero), the player who caused the KO gets one point and draws a card from a 50-card deck.
- The game ends when one player has no Pokémon left. The winner is the player with the most points.

What’s in the deck?
- The deck has 50 special cards. Examples:
  - Heal: restore some health
  - Revive: bring a fainted Pokémon back with a little health
  - Shield: reduce next damage
  - Boost: temporarily make a Pokémon stronger

Game steps we’ll build
1. Get 20 Pokémon from the PokeAPI (online Pokémon database).
2. Each player picks 6 Pokémon.
3. Flip a coin to see who starts.
4. Both players choose a move or an action each turn.
5. We decide who goes first by the Pokémon’s speed. Faster Pokémon go first.
6. If one Pokémon faints, the player who knocked it out gets 1 point and draws a card.
7. Keep playing until one player has no Pokémon left. The player with the most points wins!

How we’ll make it
- We’ll use a JavaScript app that runs in the browser (no server needed). We'll use the PokeAPI to get Pokémon pictures and stats.
- All the game data runs on your computer’s browser, so you can play without a server.

What you will do and learn
- Picking Pokémon and moves — strategy!
- Using cards at the right time — strategy!
- Learning how type-effectiveness works (like water > fire) — tactical thinking!
- Basic programming builds, if you want to help code later — fun learning!

Rules for Adam (quick guide)
- Pick 6 Pokémon you like.
- Each turn you get to choose an action: attack, switch, dodge, block, or use a card.
- Use type advantages (like water against fire) to hit harder.
- Use cards when you’re in trouble — but they’re rare.
- Try not to lose all your Pokémon!

Next steps
- Start building the app so we can pick Pokémon and play.
- We'll keep the rules simple and add things as we test and play.

That’s it! Ready to start building?
