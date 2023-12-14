
function playRound(player, opponent, selectedCard, opponentCard){
    player.deck.push(selectedCard);
    console.log(`${player.name} selected ${selectedCard}`)
    let idx = cards.indexOf(selectedCard);
    if (idx > -1) {
        cards.splice(idx, 1);
    }

    player.budget -= selectedCard;
    if (opponentCard <= opponent.budget) {
        console.log(`${opponent.name} gets ${opponentCard}`)
        opponent.deck.push(opponent);
        opponent.budget -= opponentCard;
        let idxOpp = cards.indexOf(opponentCard);
        if (idxOpp > -1) {
            cards.splice(idxOpp, 1);
        }
    }else{
        console.log(`${opponent.name} doesn't have enough budget to get ${opponentCard}`)
    }
}

function showCard(revealedCards) {
    console.log(`Showing cards: ${revealedCards[0]}, ${revealedCards[1]}`);
}

function waitForSelection(){
    return new Promise ((resolve) => {
        const buttonFirstCard = document.getElementById('first-card');
        const buttonSecondCard = document.getElementById('second-card');
        buttonFirstCard.addEventListener('click', () => resolve('first'));
        buttonSecondCard.addEventListener('click', () => resolve('second'));
    });
}

// pick two cards at random from the deck. Two cards must have lower value than the current player's budget.
function pickCards(currentPlayer, cards){
    const buttonFirstCard = document.getElementById('first-card');
    const buttonSecondCard = document.getElementById('second-card');
    // filter cards that have lower value than the current player's budget
    let filteredCards = cards.filter(card => card <= currentPlayer.budget);
    if (filteredCards.length >= 2) {
        // pick two cards at random
        let chosenCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
        // remove chosen card from the deck
        let index = filteredCards.indexOf(chosenCard);
        if (index > -1) {
            filteredCards.splice(index, 1);
        }
        // pick another card at random
        let otherCard = filteredCards[Math.floor(Math.random() * filteredCards.length)];
        // change button text to show the cards
        buttonFirstCard.innerHTML = chosenCard;
        buttonSecondCard.innerHTML = otherCard;
        return [chosenCard, otherCard];
    } else if (filteredCards.length() === 1){
        return filteredCards;
    } else if (filteredCards.length() === 0){
        return [];
    }
}

let swapPlayers = (currentPlayer, otherPlayer) => [otherPlayer, currentPlayer];

async function choose_cards(){
    // generate 20 random cards with values between 1 and 10
    console.log("All cards:")
    console.log(cards);

    let currentPlayer = player1;
    let otherPlayer = player2;
    let finished = false;
    while (!finished){
        let revealedCards = pickCards(currentPlayer, cards);
        if (revealedCards.length === 0){
            console.log(`${currentPlayer.name} doesn't have budget to select any remaining cards. Going to next player.`);
            currentPlayer, otherPlayer = swap_players(currentPlayer, otherPlayer);
        } else if (revealedCards.length === 1){
            console.log(`${currentPlayer.name} can only pick one card: ${revealedCards[0]}`);
            currentPlayer, otherPlayer = swap_players(currentPlayer, otherPlayer);
        } else {
            showCard(revealedCards);
            let selection = await waitForSelection();
            let selectedCard;
            let opponentCard;
            if (selection === 'first'){
                selectedCard = revealedCards[0];
                opponentCard = revealedCards[1];
            }else{
                selectedCard = revealedCards[1];
                opponentCard = revealedCards[0];
            }
            playRound(currentPlayer, otherPlayer, selectedCard, opponentCard);
            [currentPlayer, otherPlayer] = swapPlayers(currentPlayer, otherPlayer);
            console.log(`current: ${currentPlayer.name}`);
            console.log(`other: ${otherPlayer.name}`);
        }
    }
}

let player1 = {
    name: 'Alice',
    budget: 100,
    deck: [],
}
let player2 = {
    name: 'Bob',
    budget: 100,
    deck: []
}
let cards = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10) + 1)

choose_cards();
