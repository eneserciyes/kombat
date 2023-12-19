class Player {
    constructor(name, budget, score) {
        this.name = name;
        this.budget = budget;
        this.score = score;
        this.deck = [];
        this.finished_selection = false;
    }
}

class Card {
    constructor(name, strength) {
        this.name = name;
        this.strength = strength;
        this.img = FIGHTER_IMG_URL[name];
    }
}

const FIGHTER_IMG_URL = {
    'cassie-cage': 'imgs/characters/cassie-cage.png',
    'ermac': 'imgs/characters/ermac.png',
    'erron-black': 'imgs/characters/erron-black.png',
    'goro': 'imgs/characters/goro.webp',
    'jacqui-briggs': 'imgs/characters/jacqui-briggs.webp',
    'johnny-cage': 'imgs/characters/johnny-cage.png',
    'kano': 'imgs/characters/kano.png',
    'kenshi': 'imgs/characters/kenshi.webp',
    'kitana': 'imgs/characters/kitana.png',
    'kotal-kahn': 'imgs/characters/kotal-kahn.png',
    'kung-lao': 'imgs/characters/kung-lao.webp',
    'liu-kang': 'imgs/characters/liu-kang.png',
    'raiden': 'imgs/characters/raiden.png',
    'rain': 'imgs/characters/rain.png',
    'scorpion': 'imgs/characters/scorpion.webp',
    'sergeant': 'imgs/characters/sergeant.webp',
    'shinnok': 'imgs/characters/shinnok.webp',
    'shirai-ryu': 'imgs/characters/shirai-ryu.webp',
    'sonya-blade': 'imgs/characters/sonya-blade.png',
    'subzero': 'imgs/characters/subzero.png',
    'takeda': 'imgs/characters/takeda.webp',
    'trooper': 'imgs/characters/trooper.webp'
};

const ALL_CARDS = [
    new Card('cassie-cage', 4),
    new Card('ermac', 5),
    new Card('erron-black', 6),
    new Card('goro', 8),
    new Card('jacqui-briggs', 3),
    new Card('johnny-cage', 5),
    new Card('kano', 4),
    new Card('kenshi', 7),
    new Card('kitana', 8),
    new Card('kotal-kahn', 6),
    new Card('kung-lao', 5),
    new Card('liu-kang', 7),
    new Card('raiden', 10),
    new Card('rain', 9),
    new Card('scorpion', 8),
    new Card('sergeant', 2),
    new Card('shinnok', 10),
    new Card('shirai-ryu', 1),
    new Card('sonya-blade', 6),
    new Card('subzero', 9),
    new Card('takeda', 7),
    new Card('trooper', 1)
];

///////////////////////////
//// HTML Functions ///////
///////////////////////////
function getCardHTML(card, selectable = false) {
    let border = (card.strength < 7) ? 'silver' : 'gold';
    let selectableClass = (selectable) ? 'selectable' : '';
    return `<div class="card-wrapper ${border} ${selectableClass}">
        <div class="card" style="background-image: url(${card.img});">
        <div class="card-info">
        <p class="card-name">${card.name}</p>
        <p class="card-strength">${card.strength}</p>
        </div>
        </div>
        </div>`
}

///////////////////////////
//  DOM Update Functions //
///////////////////////////

function updatePlayerInfo() {
    let p1name = document.querySelector('#player1-info #name');
    let p2name = document.querySelector('#player2-info #name');
    let deck1_pname = document.querySelector('#p1-deck-name');
    let deck2_pname = document.querySelector('#p2-deck-name');

    p1name.innerHTML = player1.name;
    p2name.innerHTML = player2.name;
    deck1_pname.innerHTML = `${player1.name}'s deck`;
    deck2_pname.innerHTML = `${player2.name}'s deck`;
}

function updateAllCards() {
    let allFightersDiv = document.querySelector('#all-fighters .card-tiler-div');
    allFightersDiv.innerHTML = ''; // clear the div
    cards.forEach(card => {
        allFightersDiv.innerHTML += getCardHTML(card);
    });
}

function updatePlayerDecks(selectable=false) {
    let player1CardsDiv = document.getElementById('player1-cards');
    let player2CardsDiv = document.getElementById('player2-cards');

    // Clear the divs
    player1CardsDiv.innerHTML = '';
    player2CardsDiv.innerHTML = '';

    // Add the cards to the divs
    player1.deck.forEach(card => {
        player1CardsDiv.innerHTML += getCardHTML(card, selectable = selectable);
    });

    player2.deck.forEach(card => {
        player2CardsDiv.innerHTML += getCardHTML(card, selectable = selectable);
    });
}

function updateSelectableCards(revealedCards) {
    let selectableCardsDiv = document.querySelector('#selection-arena .card-tiler-div');
    selectableCardsDiv.innerHTML = ''; // clear the div
    revealedCards.forEach(card => {
        selectableCardsDiv.innerHTML += getCardHTML(card, selectable = true);
    });
}

function updateFightArena(card) {
    let fightArenaDiv = document.querySelector('#fight-arena .card-tiler-div');
    fightArenaDiv.innerHTML += getCardHTML(card);
}

function clearFightArena() {
    let fightArenaDiv = document.querySelector('#fight-arena .card-tiler-div');
    fightArenaDiv.innerHTML = '';
}

function updateBudgets() {
    let player1Budget = document.querySelector('#player1-info .budget-container #budget');
    let player2Budget = document.querySelector('#player2-info .budget-container #budget');

    player1Budget.innerHTML = 'Budget: ' + player1.budget;
    player2Budget.innerHTML = 'Budget: ' + player2.budget;
}

function updateScores() {
    let player1Score = document.querySelector('#player1-info .score-container #score');
    let player2Score = document.querySelector('#player2-info .score-container #score');

    player1Score.innerHTML = 'Score: ' + player1.score;
    player2Score.innerHTML = 'Score: ' + player2.score;
}

function updateRound() {
    let roundInfo = document.querySelector('#round-info');
    roundInfo.innerHTML = `Round #${round}/${max_rounds}`;
}

function updateTurn(currentPlayer) {
    let turnInfo = document.querySelector('#turn-info');
    turnInfo.innerHTML = `${currentPlayer.name}'s turn`;
}

function updatePhase(phase) {
    let phaseInfo = document.querySelector('#phase-info');
    if (phase === 'selection') {
        phaseInfo.innerHTML = `Pick Your Fighters!`;
    } else if (phase === 'fighting') {
        phaseInfo.innerHTML = `Fight!`;
    }
}

function hideSelectionArena() {
    let selectionArena = document.querySelector('#selection-arena');
    let allFighters = document.querySelector('#all-fighters');
    let budgets = document.querySelectorAll('.budget-container');
    selectionArena.style.display = 'none';
    allFighters.style.display = 'none';
    budgets.forEach(budget => {
        budget.style.display = 'none';
    });
}

function displayFightArena() {
    let fightArena = document.querySelector('#fight-arena');
    let scores = document.querySelectorAll('.score-container');
    fightArena.style.display = 'flex';
    scores.forEach(score => {
        score.style.display = 'flex';
    });
    makeDeckSelectable();
}

function makeDeckSelectable() {
    let playerDeckCards = document.querySelectorAll('.deck-container .card-wrapper');
    playerDeckCards.forEach(card => {
        card.classList.add('selectable');
    });
}

function displayWinner() {
    let result = document.querySelector('#result');
    let winnerText = document.querySelector('#result #winner');
    let fightArena = document.querySelector('#fight-arena');
    fightArena.style.display = 'none';
    result.style.display = 'flex';
    
    if (player1.score > player2.score) {
        winnerText.innerHTML = `${player1.name} wins!`;
    } else if (player2.score > player1.score) {
        winnerText.innerHTML = `${player2.name} wins!`;
    } else {
        winnerText.innerHTML = `It's a tie!`;
    }
}

function showNotification(message) {
    let notification = document.querySelector('#notification');
    notification.innerHTML = message;
    notification.style.display = 'block';
    setTimeout(function() {
        notification.style.display = 'none';
    }, 5000);
}

///////////////////////////
///  Listener Functions ///
///////////////////////////

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function waitForSelection() {
    return new Promise((resolve) => {
        let selectableCards = document.querySelectorAll('#selection-arena .card-tiler-div .card-wrapper');
        let firstCard = selectableCards[0];
        let secondCard = selectableCards[1];

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

function chooseCardForMatch(currentPlayer) {
    return new Promise((resolve) => {
        if (currentPlayer === player1) {
            let playerDeckCards = document.querySelectorAll('#player1-cards .card-wrapper');
            playerDeckCards.forEach((card, idx) => {
                card.addEventListener('click', function() {
                    let selectedCard = currentPlayer.deck[idx];
                    currentPlayer.deck.splice(idx, 1);
                    updatePlayerDecks(selectable=true);
                    resolve(selectedCard);
                });
            });
        } else {
            let playerDeckCards = document.querySelectorAll('#player2-cards .card-wrapper');
            playerDeckCards.forEach((card, idx) => {
                card.addEventListener('click', function() {
                    let selectedCard = currentPlayer.deck[idx];
                    currentPlayer.deck.splice(idx, 1);
                    updatePlayerDecks(selectable=true);
                    resolve(selectedCard);
                });
            });
        }
    });
}

///////////////////////////
/////  Game Functions ////
//////////////////////////

function generateCards() {
    let cards = [];
    let length = ALL_CARDS.length;
    for (let i = 0; i < 2 * max_rounds; i++) {
        cards.push(ALL_CARDS[Math.floor(Math.random() * length)]);
    }
    return cards;
}
function addCardToDeck(player, card) {
    if (card.strength <= player.budget) {
        console.log(`${player.name} gets ${card.name}`)
        player.deck.push(card);
        player.budget -= card.strength;
        let idx = cards.indexOf(card);
        if (idx > -1) {
            cards.splice(idx, 1);
        }
    }
}
function applySelection(player, selectedCard, opponentCard) {
    let opponent = getOpponent(player);
    addCardToDeck(player, selectedCard);
    addCardToDeck(opponent, opponentCard);
}

function playRound(card1, card2) {
    winProb = card1.strength / (card1.strength + card2.strength);
    let rand = Math.random();
    if (rand < winProb) {
        return 1;
    } else if (rand > winProb) {
        return 2;
    }
}

function revealCards(currentPlayer) {
    let filteredCards = cards.filter(card => card.strength <= currentPlayer.budget);

    if (filteredCards.length >= 2) {
        let idx1 = Math.floor(Math.random() * filteredCards.length);
        let card1 = filteredCards[idx1];

        let idx2 = idx1;
        while (idx2 === idx1) {
            idx2 = Math.floor(Math.random() * filteredCards.length);
        }
        let card2 = filteredCards[idx2];

        return [card1, card2];
    } else if (filteredCards.length === 1) {
        return filteredCards;
    } else if (filteredCards.length === 0) {
        return [];
    }
}
function switchPlayerForSelectionPhase(currentPlayer) {
    opponent = getOpponent(currentPlayer);
    if (!opponent.finished_selection) {
        return opponent;
    } else {
        return currentPlayer;
    }
}

let getOpponent = (currentPlayer) => (currentPlayer === player1) ? player2 : player1;

async function chooseCards() {
    let currentPlayer = player1;
    updateTurn(currentPlayer);
    updateBudgets();
    updateRound();
    while (!player1.finished_selection || !player2.finished_selection) {
        let revealedCards = revealCards(currentPlayer);
        if (revealedCards.length === 0) {
            console.log(`${currentPlayer.name} cannot get any of the remaining cards. Their turn is over.`)
            showNotification(`${currentPlayer.name} cannot get any of the remaining cards. Their turn is over.`);
            currentPlayer.finished_selection = true;
        } else if (revealedCards.length === 1) {
            console.log(`${currentPlayer.name} can only get one of the remaining cards. ${revealedCards[0].name} is added to their deck.`);
            addCardToDeck(currentPlayer, revealedCards[0]);
            showNotification(`${currentPlayer.name} can only get one of the remaining cards. ${revealedCards[0].name} is added to their deck.`);
            currentPlayer.finished_selection = true;
        } else {
            updateSelectableCards(revealedCards);
            let selection = await waitForSelection();
            if (selection === 'first') {
                applySelection(currentPlayer, revealedCards[0], revealedCards[1]);
            } else if (selection === 'second') {
                applySelection(currentPlayer, revealedCards[1], revealedCards[0]);
            }
        }
        // round = round+1;
        updatePlayerDecks();
        updateBudgets();
        updateAllCards();

        if (revealedCards.length < 2) {
            await sleep(2000);
        }
        currentPlayer = switchPlayerForSelectionPhase(currentPlayer);
        updateTurn(currentPlayer);
    }
    console.log("Selection over");
}

async function playFights() {
    // update max rounds
    max_rounds = Math.min(player1.deck.length, player2.deck.length);
    updateScores(player1, player2);
    let finished = false;
    let playButton = document.querySelector('#play-button');
    while (!finished) {
        updateTurn(player1);
        let card1 = await chooseCardForMatch(player1);
        updateFightArena(card1);

        updateTurn(player2);
        let card2 = await chooseCardForMatch(player2);
        updateFightArena(card2);

        let playButtonEventHandler = function() {
            let winner = playRound(card1, card2);
            if (winner === 1) {
                player1.score = player1.score + 1;
                console.log(`${player1.name} wins this match!`);
            } else {
                player2.score = player2.score + 1;
                console.log(`${player2.name} wins this match!`);
            }
            updateScores(player1, player2);
            // hide court cards
            clearFightArena();
            // update round
            round = round + 1;
            if (round > max_rounds) {
                finished = true;
                console.log("Game over");
            } else {
                updateRound(round, max_rounds);
            }
            playButton.removeEventListener('click', playButtonEventHandler);
        }
        playButton.addEventListener('click', playButtonEventHandler);
    }
}

async function resolveCardsRemainingInTheDecks() {
    if (player1.deck.length > 0) {
        showNotification(`${player1.name} has ${player1.deck.length} cards left in their deck. They are added to their score.`);
        player1.score += player1.deck.length;
        player1.deck = [];
        await sleep(2000);
    } else if(player2.deck.length > 0) {
        showNotification(`${player2.name} has ${player2.deck.length} cards left in their deck. They are added to their score.`);
        player2.score += player2.deck.length;
        player2.deck = [];
        await sleep(2000);
    } 
    updateScores();
}

let phase = '';
let round = 1;
let max_rounds = 6;
let budgetRatio = 0.6;

let player1 = new Player('Alice', max_rounds * 10 * budgetRatio, 0);
let player2 = new Player('Bob', max_rounds * 10 * budgetRatio, 0);

let cards = generateCards();

// start game
async function playGame(){
    updatePhase('selection');
    updatePlayerInfo();
    updateAllCards();
    await chooseCards();
    hideSelectionArena();
    displayFightArena();
    updatePhase('fighting');
    await playFights();
    await resolveCardsRemainingInTheDecks();
    displayWinner();
};

playGame();

