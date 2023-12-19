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
    'kassie': 'imgs/new-characters/kassie.png',
    'ermac': 'imgs/new-characters/ermac.png',
    'captain': 'imgs/new-characters/captain.png',
    'zoro': 'imgs/new-characters/zoro.png',
    'briggs': 'imgs/new-characters/briggs.png',
    'johnny': 'imgs/new-characters/johnny.png',
    'kanon': 'imgs/new-characters/kanon.png',
    'kenshi': 'imgs/new-characters/kenshi.png',
    'kita': 'imgs/new-characters/kita.png',
    'kotal-kahn': 'imgs/new-characters/kotal-kahn.png',
    'lao': 'imgs/new-characters/lao.png',
    'kang': 'imgs/new-characters/kang.png',
    'raid': 'imgs/new-characters/raid.png',
    'rain': 'imgs/new-characters/rain.png',
    'scorp': 'imgs/new-characters/scorp.png',
    'khal': 'imgs/new-characters/khal.png',
    'shin': 'imgs/new-characters/shin.png',
    'ninja': 'imgs/new-characters/ninja.png',
    'sofia-blade': 'imgs/new-characters/sofia-blade.png',
    'sub-z': 'imgs/new-characters/sub-z.png',
    'takeshima': 'imgs/new-characters/takeshima.png',
    'trooper': 'imgs/new-characters/trooper.png'
};

const ALL_CARDS = [
    new Card('kassie', 4),
    new Card('ermac', 5),
    new Card('khal', 6),
    new Card('zoro', 8),
    new Card('briggs', 3),
    new Card('johnny', 5),
    new Card('kanon', 4),
    new Card('kenshi', 7),
    new Card('kita', 8),
    new Card('kotal-kahn', 6),
    new Card('lao', 5),
    new Card('kang', 7),
    new Card('raid', 10),
    new Card('rain', 9),
    new Card('scorp', 8),
    new Card('captain', 2),
    new Card('shin', 10),
    new Card('ninja', 1),
    new Card('sofia-blade', 6),
    new Card('sub-z', 9),
    new Card('takeshima', 7),
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

function updatePlayerDecks(selectable = false) {
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
    roundInfo.innerHTML = `Round ${round}/${MAX_ROUNDS}`;
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

function hideSettings() {
    let settings = document.querySelector('#settings-screen');
    settings.style.display = 'none';
}

function displayGame() {
    let game = document.querySelector('#game-board');
    let header = document.querySelector('header');
    header.style.display = 'flex';
    game.style.display = 'flex';
}

///////////////////////////
///  Settings Functions ///
///////////////////////////
{
    let sliderBudgetRatio = document.querySelector('#budget-ratio-picker-item input');
    let sliderMaxRounds = document.querySelector('#max-rounds-picker-item input');
    let selectMode = document.querySelector('#play-mode-picker-item select');
    let sliderBudgetRatioValue = document.querySelector('#budget-ratio-picker-item .setting-picker-item-input-value');
    let sliderMaxRoundsValue = document.querySelector('#max-rounds-picker-item .setting-picker-item-input-value');
    let player1Name = document.querySelector('#player1-name-picker-item');
    let player2Name = document.querySelector('#player2-name-picker-item');
    let startButton = document.querySelector('#start-game-button');

    sliderBudgetRatio.onchange = function() {
        sliderBudgetRatioValue.innerHTML = sliderBudgetRatio.value / 10;
    }
    sliderMaxRounds.onchange = function() {
        sliderMaxRoundsValue.innerHTML = sliderMaxRounds.value;
    }
    selectMode.onchange = function() {
        if (selectMode.value === "Human vs Human") {
            player2Name.style.display = 'flex';
        } else {
            player2Name.style.display = 'none';
        }
    }

    startButton.onclick = function() {
        let player1NameInput = player1Name.querySelector('input').value;
        let player2NameInput = player2Name.querySelector('input').value;

        let sliderBudgetRatioValue = sliderBudgetRatio.value / 10;
        let sliderMaxRoundsValue = sliderMaxRounds.value;

        let playMode = selectMode.value;

        hideSettings();
        displayGame();
        playGame(player1NameInput, player2NameInput, sliderBudgetRatioValue, sliderMaxRoundsValue, playMode);
    }
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
                    updatePlayerDecks(selectable = true);
                    resolve(selectedCard);
                });
            });
        } else {
            let playerDeckCards = document.querySelectorAll('#player2-cards .card-wrapper');
            playerDeckCards.forEach((card, idx) => {
                card.addEventListener('click', function() {
                    let selectedCard = currentPlayer.deck[idx];
                    currentPlayer.deck.splice(idx, 1);
                    updatePlayerDecks(selectable = true);
                    resolve(selectedCard);
                });
            });
        }
    });
}

function waitForPlayButton() {
    return new Promise((resolve) => {
        let playButton = document.querySelector('#play-button');
        let playButtonHandler = function() { resolve(); playButton.removeEventListener('click', playButtonHandler); };
        playButton.addEventListener('click', playButtonHandler);
    });
}
///////////////////////////
/////  Game Functions ////
//////////////////////////

function generateCards() {
    let cards = [];
    let length = ALL_CARDS.length;
    for (let i = 0; i < 2 * MAX_ROUNDS; i++) {
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
            let selection = null;
            if (currentPlayer.name === "Computer"){
                if (revealedCards[0].strength >= revealedCards[1].strength){
                    selection = 'first';
                } else {
                    selection = 'second';
                }
                await sleep(2000);
            }else{
                selection = await waitForSelection();
            }
            if (selection === 'first') {
                applySelection(currentPlayer, revealedCards[0], revealedCards[1]);
            } else if (selection === 'second') {
                applySelection(currentPlayer, revealedCards[1], revealedCards[0]);
            }
        }
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
    updateScores(player1, player2);
    let finished = false;
    while (!finished) {
        updateTurn(player1);
        let card1 = await chooseCardForMatch(player1);
        updateFightArena(card1);

        updateTurn(player2);
        let card2 = null;
        if (player2.name === "Computer"){
            let candidateCards = player2.deck.filter(card => card.strength >= card1.strength); 
            let idx = null
            if (candidateCards.length > 0){
                idx = Math.floor(Math.random() * candidateCards.length);
                card2 = candidateCards[idx];
            }else{
                idx = Math.floor(Math.random() * player2.deck.length);
                card2 = player2.deck[idx];
            }
            player2.deck.splice(idx, 1); 
            await sleep(2000);
            updatePlayerDecks(selectable = true);
        }else{
            card2 = await chooseCardForMatch(player2);
        }
        updateFightArena(card2);

        await waitForPlayButton();

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
        if (round > MAX_ROUNDS) {
            finished = true;
            console.log("Game over");
        } else {
            updateRound(round, MAX_ROUNDS);
        }
    }
}

async function resolveCardsRemainingInTheDecks() {
    if (player1.deck.length > 0) {
        showNotification(`${player1.name} has ${player1.deck.length} cards left in their deck. They are added to their score.`);
        player1.score += player1.deck.length;
        player1.deck = [];
        await sleep(2000);
    } else if (player2.deck.length > 0) {
        showNotification(`${player2.name} has ${player2.deck.length} cards left in their deck. They are added to their score.`);
        player2.score += player2.deck.length;
        player2.deck = [];
        await sleep(2000);
    }
    updateScores();
}

let phase = '';
let round = 1;
let MAX_ROUNDS = null;
let BUDGET_RATIO = null;

let player1 = null
let player2 = null

let cards = null;

// start game
async function playGame(player1Name, player2Name, budgetRatio, maxRounds, playMode) {
    // initialize game
    if (player1Name == ""){
        player1Name = "Player 1";
    }
    if (player2Name == ""){
        player2Name = "Player 2";
    }
    if (playMode === "Me vs Computer") {
        player2Name = "Computer";
    }
    player1 = new Player(player1Name, maxRounds * 10 * budgetRatio, 0);
    player2 = new Player(player2Name, maxRounds * 10 * budgetRatio, 0);
    MAX_ROUNDS = maxRounds;
    BUDGET_RATIO = budgetRatio;
    cards = generateCards();

    updatePhase('selection');
    updatePlayerInfo();
    updateAllCards();

    await chooseCards();

    hideSelectionArena();
    displayFightArena();
    
    updatePhase('fighting');
    MAX_ROUNDS = Math.min(player1.deck.length, player2.deck.length);
    updateRound();

    await playFights();
    await resolveCardsRemainingInTheDecks();

    displayWinner();
};
