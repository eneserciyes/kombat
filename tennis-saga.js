const playerColors = {
    1: '#e82020', // replace with player1's color
    2: '#2020e8'  // replace with player2's color
};

function getSelectedCard(){
    if (firstCard.classList.contains('selected')) {
        console.log('First card selected');
        return 'first'
        // Add your code to handle the first card being selected here
    } else if (secondCard.classList.contains('selected')) {
        console.log('Second card selected');
        return 'second'
        // Add your code to handle the second card being selected here
    } else {
        console.log('No card selected');
        // Add your code to handle no card being selected here
    }
}

function selectionRound(player, opponent, selectedCard, opponentCard){
    player.deck.push(selectedCard);
    console.log(`${player.name} selected ${selectedCard}`)
    let idx = cards.indexOf(selectedCard);
    if (idx > -1) {
        cards.splice(idx, 1);
    }

    player.budget -= selectedCard;
    if (opponentCard <= opponent.budget) {
        console.log(`${opponent.name} gets ${opponentCard}`)
        opponent.deck.push(opponentCard);
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
        let firstCard = document.getElementById('first-card');
        let secondCard = document.getElementById('second-card');

        // Define the event handler functions
        let firstCardHandler = function() {
            console.log('first card clicked');
            resolve('first');

            // Remove the event listeners
            firstCard.removeEventListener('click', firstCardHandler);
            secondCard.removeEventListener('click', secondCardHandler);
        };

        let secondCardHandler = function() {
            console.log('second card clicked');
            resolve('second');

            // Remove the event listeners
            firstCard.removeEventListener('click', firstCardHandler);
            secondCard.removeEventListener('click', secondCardHandler);
        };

        // Add the event listeners
        firstCard.addEventListener('click', firstCardHandler);
        secondCard.addEventListener('click', secondCardHandler); 
    });
}

// pick two cards at random from the deck. Two cards must have lower value than the current player's budget.
function pickCards(currentPlayer, cards){
    const buttonFirstCard = document.querySelector('#first-card p');
    const buttonSecondCard = document.querySelector('#second-card p');
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
        buttonFirstCard.innerHTML = `Strength: ${chosenCard}`;
        buttonSecondCard.innerHTML = `Strength: ${otherCard}`;
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
            currentPlayer, otherPlayer = swapPlayers(currentPlayer, otherPlayer);
        } else if (revealedCards.length === 1){
            console.log(`${currentPlayer.name} can only pick one card: ${revealedCards[0]}`);
            currentPlayer, otherPlayer = swapPlayers(currentPlayer, otherPlayer);
        } else {
            showCard(revealedCards);
            let selection = await waitForSelection();
            if (selection === 'first'){
                selectionRound(currentPlayer, otherPlayer, revealedCards[0], revealedCards[1]);
            }else{
                selectionRound(currentPlayer, otherPlayer, revealedCards[1], revealedCards[0]);
            }
            updatePlayerDecks(player1, player2);
            [currentPlayer, otherPlayer] = swapPlayers(currentPlayer, otherPlayer);
        }
    }
}

function updatePlayerDecks(player1, player2) {
    let player1CardsDiv = document.getElementById('player1-cards');
    let player2CardsDiv = document.getElementById('player2-cards');

    // Clear the divs
    player1CardsDiv.innerHTML = '';
    player2CardsDiv.innerHTML = '';

    // Add the cards to the divs
    player1.deck.forEach(card => {
        player1CardsDiv.innerHTML += `<div class="card"><p>Strength: ${card}</p></div>`; // replace `card.name` with the property that contains the card's name
    });

    player2.deck.forEach(card => {
        player2CardsDiv.innerHTML += `<div class="card"><p>Strength: ${card}</p></div>`; // replace `card.name` with the property that contains the card's name
    });
}

let player1 = {
    id: 1,
    name: 'Alice',
    budget: 100,
    deck: [],
}
let player2 = {
    id: 2,
    name: 'Bob',
    budget: 100,
    deck: []
}
let cards = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10) + 1)

choose_cards();
