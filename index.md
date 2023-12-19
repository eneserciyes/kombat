# Intro

You are about to go into an epic Kombat with your opponent. But first, you have to pick your players. You can see all figthers but each round, two fighters are available; you have to pick one of them, the other one goes to your opponent. Fighters's strengths are deducted from your budget. The Kombat begins after the selection process is over. Be careful, you might run out of budget before the end of the selection process.

In the Kombat phase, each player chooses a fighter from their deck to fight against a fighter from the opponent's team. Player 1 always places the first fighter. The survivor scores a point for their team. The Kombat is over when all fighters have taken stage.

## Rules

- Each fighter has a strength value between 1 and 10. This is also the amount of budget it costs to pick them.
- If Fighter 1 has x strength and the Fighter 2 has y strength. Figther 1 prevails with probability x/(x+y) and Fighter 2 prevails with probability y/(x+y).
- If a player has no budget left, they can't pick a fighter. The selection process is over.
- The Kombat begins when either no fighters remain to pick or both players' budgets are not enough to pick any more fighters. 
- The cards revealed at each round are guaranteed to be selectable by the current player. However, the other player may not be able to afford the card current player did not select.
- If only one card can be afforded by the current player, that card is automatically added to their deck and the turn switches to the other player.
- If one player has more players than the other, when one player runs out of fighters, the remaining fighters automatically win the remaining challenges.
