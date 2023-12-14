const playerColors = {
    1: '#ffc9c9', // replace with player1's color
    2: '#a5d8ff'  // replace with player2's color
};

function selectionRound(player, opponent, selectedCard, opponentCard){
    let cardSelected = false;
    if (selectedCard <= player.budget){
        player.deck.push(selectedCard);
        player.budget -= selectedCard;
        console.log(`${player.name} selected ${selectedCard}`)
        let idx = cards.indexOf(selectedCard);
        if (idx > -1) {
            cards.splice(idx, 1);
        }
        cardSelected = true;
    }
    if (cardSelected && opponentCard!=0 && opponentCard <= opponent.budget) {
        console.log(`${opponent.name} gets ${opponentCard}`)
        opponent.deck.push(opponentCard);
        opponent.budget -= opponentCard;
        let idxOpp = cards.indexOf(opponentCard);
        if (idxOpp > -1) {
            cards.splice(idxOpp, 1);
        }
    }
    return cardSelected;
}

function playRound(card1, card2){
    winProb = card1/(card1+card2);
    let rand = Math.random();
    if (rand < winProb){
        return 1;
    } else if (rand > winProb){
        return 2;
    }
}

function showCard(revealedCards) {
    console.log(`Showing cards: ${revealedCards[0]}, ${revealedCards[1]}`);
}

function waitForSelection(){
    return new Promise ((resolve) => {
        let firstCard = document.getElementById('first-card');
        let secondCard = document.getElementById('second-card');
        let passButton = document.getElementById('pass-button');

        // Define the event handler functions
        let firstCardHandler = function() {
            console.log('first card clicked');
            resolve('first');

            // Remove the event listeners
            firstCard.removeEventListener('click', firstCardHandler);
            secondCard.removeEventListener('click', secondCardHandler);
            passButton.removeEventListener('click', passButtonHandler);
        };

        let secondCardHandler = function() {
            console.log('second card clicked');
            resolve('second');

            // Remove the event listeners
            firstCard.removeEventListener('click', firstCardHandler);
            secondCard.removeEventListener('click', secondCardHandler);
            passButton.removeEventListener('click', passButtonHandler);
        };

        let passButtonHandler = function() {
            console.log('pass button clicked');
            resolve('pass');

            firstCard.removeEventListener('click', firstCardHandler);
            secondCard.removeEventListener('click', secondCardHandler);
            passButton.removeEventListener('click', passButtonHandler);
        }

        // Add the event listeners
        firstCard.addEventListener('click', firstCardHandler);
        secondCard.addEventListener('click', secondCardHandler); 
        passButton.addEventListener('click', passButtonHandler);
    });
}

// pick two cards at random from the deck. Two cards must have lower value than the current player's budget.
function pickCards(currentPlayer, cards){
    const buttonFirstCard = document.querySelector('#first-card p');
    const buttonSecondCard = document.querySelector('#second-card p');

    filteredCards = cards.filter(card => card >= 0);

    if (cards.length >= 2) {
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
    } else if (cards.length === 1){
        buttonFirstCard.innerHTML = `Strength: ${cards[0]}`;
        buttonSecondCard.innerHTML = `No other players available`;
        buttonSecondCard.style.backgroundColor = '#bfbfbf';
        return cards;
    } else if (cards.length === 0){
        console.log("Selection phase over")
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
    updateTurn(currentPlayer);
    updateBudgets(player1, player2);
    updateRound(round, max_rounds);
    while (!finished){
        let revealedCards = pickCards(currentPlayer, cards);
        if (revealedCards.length === 0){
            console.log(`Selection over`);
        } else {
            if (revealedCards.length === 1){
                console.log(`${currentPlayer.name} can only pick one card: ${revealedCards[0]}`);
            } 
            showCard(revealedCards);
            let is_card_selected_or_passed = false;
            while (!is_card_selected_or_passed){ 
                let selection = await waitForSelection();
                if (selection === 'first'){
                    if (revealedCards.length === 1) {
                        is_card_selected_or_passed = selectionRound(currentPlayer, otherPlayer, revealedCards[0], 0);
                    }else{
                        is_card_selected_or_passed = selectionRound(currentPlayer, otherPlayer, revealedCards[0], revealedCards[1]);
                        if (!is_card_selected_or_passed){
                            alertCardNotSelected();
                        }else{
                            round = round+1;
                            [currentPlayer, otherPlayer] = swapPlayers(currentPlayer, otherPlayer);
                        }
                    }
                }else if (selection === 'second'){
                    if (revealedCards.length === 1){
                        console.log("Nothing happens")
                    }else{
                        is_card_selected_or_passed = selectionRound(currentPlayer, otherPlayer, revealedCards[1], revealedCards[0]);
                        if (!is_card_selected_or_passed){
                            alertCardNotSelected();
                        }else{
                            round= round+1;
                            [currentPlayer, otherPlayer] = swapPlayers(currentPlayer, otherPlayer);
                        }
                    }
                }else {
                    console.log(`${currentPlayer.name} passed. Going to next player.`);
                    is_card_selected_or_passed = true;
                    [currentPlayer, otherPlayer] = swapPlayers(currentPlayer, otherPlayer);
                }
            }
            updatePlayerDecks(player1, player2);
            updateBudgets(player1, player2);
            if (round > max_rounds){
                finished = true;
                console.log("Selection over");
                updatePhase('matches');
                hideSelection();
                round = 1;
                max_rounds = Math.min(player1.deck.length, player2.deck.length);
                updateRound(round, max_rounds);
                updateTurn(player1);
                playMatches();
            }else{
                updateRound(round, max_rounds);
                updateTurn(currentPlayer);
            }           
        }
    }
}

async function chooseCardForMatch(currentPlayer){
    return new Promise ((resolve) => {
        if (currentPlayer.id === 1) {
            let playerDeckCards = document.querySelectorAll('#player1-cards .card');
            playerDeckCards.forEach(card => {
                card.addEventListener('click', function(){
                    console.log('card clicked');
                    idx = currentPlayer.deck.indexOf(parseInt(card.textContent.split(' ')[1]))
                    if (idx > -1) {
                        currentPlayer.deck.splice(idx, 1);
                    }
                    updatePlayerDecks(player1, player2);
                    resolve(card);
                });
            });
        } else {
            let playerDeckCards = document.querySelectorAll('#player2-cards .card');
            playerDeckCards.forEach(card => {
                card.addEventListener('click', function(){
                    console.log('card clicked');
                    idx = currentPlayer.deck.indexOf(parseInt(card.textContent.split(' ')[1]))
                    if (idx > -1) {
                        currentPlayer.deck.splice(idx, 1);
                    }
                    updatePlayerDecks(player1, player2);
                    resolve(card);
                });
            });
        }});
}

async function playMatches(){
    displayCourt();
    updateScores(player1, player2);
    let finished = false;
    let courtCard1 = document.querySelector('#court-card-1');
    let courtCard2 = document.querySelector('#court-card-2');
    let playButton = document.querySelector('#play-button');

    while (!finished){
        let cardPlayer1 = await chooseCardForMatch(player1);
        courtCard1.innerHTML = cardPlayer1.innerHTML;
        courtCard1.style.display = 'block';


        let cardPlayer2 = await chooseCardForMatch(player2);
        courtCard2.innerHTML = cardPlayer2.innerHTML;
        courtCard2.style.display = 'block';

        let playButtonEventHandler = function() {
            let card1 = parseInt(courtCard1.textContent.split(' ')[1]);
            let card2 = parseInt(courtCard2.textContent.split(' ')[1]);

            let winner = playRound(card1, card2);
            if (winner === 1){
                player1.score = player1.score + 1;
                console.log(`${player1.name} wins this match!`);
            }else{
                player2.score = player2.score + 1;
                console.log(`${player2.name} wins this match!`);
            }
            updateScores(player1, player2);
            // hide court cards
            courtCard1.style.display = 'none';
            courtCard2.style.display = 'none';

            // update round
            round = round+1;
            if (round > max_rounds){
                finished = true;
                console.log("Game over");
                if (player1.deck.length > 0){
                    player1.score = player1.score + player1.deck.length;
                    player1.deck = [];
                }else if (player2.deck.length > 0){
                    player2.score = player2.score + player2.deck.length;
                    player2.deck = [];
                }
                updateScores(player1, player2);
                // hide court
                let court = document.querySelector('#court');
                court.style.display = 'none';

                // display winner
                let courtResult = document.querySelector('#court-result');
                let winnerText = document.querySelector('#court-result #winner');
                courtResult.style.display = 'block';

                if (player1.score > player2.score){
                    winnerText.innerHTML = `${player1.name} wins!`
                }else if (player1.score < player2.score){
                    winnerText.innerHTML = `${player2.name} wins!`
                }else{
                    winnerText.innerHTML = "It's a tie!";
                }
            }

            playButton.removeEventListener('click', playButtonEventHandler);
        }
        playButton.addEventListener('click', playButtonEventHandler);

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

function updateBudgets(player1, player2) {
    let player1Budget = document.querySelector('#player1-info #budget');
    let player2Budget = document.querySelector('#player2-info #budget');

    player1Budget.innerHTML = 'Budget: ' + player1.budget;
    player2Budget.innerHTML = 'Budget: ' + player2.budget;
}

function updateScores(player1, player2) {
    let player1Score = document.querySelector('#player1-info #score');
    let player2Score = document.querySelector('#player2-info #score');

    player1Score.innerHTML = 'Score: ' + player1.score;
    player2Score.innerHTML = 'Score: ' + player2.score;
}

function updateRound(round, max_rounds){
    let roundInfo = document.querySelector('#round-info');
    roundInfo.innerHTML = `Round #${round}/${max_rounds}`;
}

function updateTurn(currentPlayer){
    let turnInfo = document.querySelector('#turn-info');
    turnInfo.innerHTML = `${currentPlayer.name}'s turn`;
}

function updatePhase(phase){
    let phaseInfo = document.querySelector('#phase-info');
    if (phase === 'matches'){
        phaseInfo.innerHTML = `Playing Matches`;
    }
}

function hideSelection(){
    let selectableCards = document.querySelector('#selectable-cards');
    let passButton = document.querySelector('#pass-button');
    let selectionAlert = document.querySelector('#selection-alert');
    let budgets = document.querySelectorAll('#budget');
    selectableCards.style.display = 'none';
    passButton.style.display = 'none';
    selectionAlert.style.display = 'none';
    budgets.forEach(budget => {
        budget.style.display = 'none';
    });
}

function displayCourt(){
    let court = document.querySelector('#court');
    let scores = document.querySelectorAll('#score');
    court.style.display = 'block';
    scores.forEach(score => {
        score.style.display = 'block';
    });
}

function alertCardNotSelected(){
    let alertText = document.querySelector('#selection-alert');
    alertText.innerHTML = 'You cannot select this card. If you cannot select both cards, you must pass.';
}

let phase = 'selection';
let round = 1;
let max_rounds = 6;
let budgetRatio = 0.7;
let player1 = {
    id: 1,
    name: 'Alice',
    budget: max_rounds * 10 * budgetRatio,
    score: 0,
    deck: [],
}
let player2 = {
    id: 2,
    name: 'Bob',
    budget: max_rounds * 10 * budgetRatio,
    score: 0,
    deck: []
}
let cards = Array.from({ length: 2*max_rounds }, () => Math.floor(Math.random() * 10) + 1)
let p1name = document.querySelector('#player1-info #name');
let p2name = document.querySelector('#player2-info #name');
let deck1_pname = document.querySelector('#p1-deck-name');
let deck2_pname = document.querySelector('#p2-deck-name');

p1name.innerHTML = player1.name;
p2name.innerHTML = player2.name;
deck1_pname.innerHTML = `${player1.name}'s bench`;
deck2_pname.innerHTML = `${player2.name}'s bench`;

if (phase==='selection'){
    choose_cards();
}
