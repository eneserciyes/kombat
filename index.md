# Intro

You are the coach of a tennis team. You and your opponent are about to start a tournament but first, you have to pick your players. Each round, two players are available; you have to pick one of them, the other one goes to your opponent. Player's strengths are deducted from your budget. The tournament begins after the selection process is over. Be careful, you might run out of budget before the end of the selection process.

In the tournament phase, each player chooses a player from their team to play against a player from the opponent's team. The winner of a match scores a point for their team. The tournament is over when all players have played.

## Rules

- Each player has a strength value between 1 and 10. This is also the amount of budget it costs to pick them.
- If Player 1 has x strength and the Player 2 has y strength. Player 1 wins with probability x/(x+y) and Player 2 wins with probability y/(x+y).
- If a coach has no budget left, they can't pick a player.
- If both coaches have no budget left, the tournament begins before the end of the selection process.
- If one coach has more players than the other, when one coach runs out of players, the remaining players automatically win the remaining matches.
