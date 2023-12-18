class Player{
    constructor(name, budget, score){
        this.name = name;
        this.budget = budget;
        this.score = score;
        this.deck = [];
    }
}

class Card{
    constructor(name, strength){
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

let phase = 'selection';
let round = 1;
let max_rounds = 6;
let budgetRatio = 0.7;

let player1 = new Player('Alice', max_rounds * 10 * budgetRatio, 0);
let player2 = new Player('Bob', max_rounds * 10 * budgetRatio, 0);

let cards = generateCards(); 


// start game
updatePlayerInfo();
updateAllCards();
chooseCards();

///////////////////////////
//// HTML Functions ///////
///////////////////////////
function getCardHTML(card, selectable=false){
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

function updatePlayerInfo(){
    let p1name = document.querySelector('#player1-info #name');
    let p2name = document.querySelector('#player2-info #name');
    let deck1_pname = document.querySelector('#p1-deck-name');
    let deck2_pname = document.querySelector('#p2-deck-name');

    p1name.innerHTML = player1.name;
    p2name.innerHTML = player2.name;
    deck1_pname.innerHTML = `${player1.name}'s deck`;
    deck2_pname.innerHTML = `${player2.name}'s deck`;
}

function updateAllCards(){
    let allFightersDiv = document.querySelector('#all-fighters .card-tiler-div');
    allFightersDiv.innerHTML = ''; // clear the div
    cards.forEach(card => {
        allFightersDiv.innerHTML += getCardHTML(card);
    });
}

function updatePlayerDecks() {
    let player1CardsDiv = document.getElementById('player1-cards');
    let player2CardsDiv = document.getElementById('player2-cards');

    // Clear the divs
    player1CardsDiv.innerHTML = '';
    player2CardsDiv.innerHTML = '';

    // Add the cards to the divs
    player1.deck.forEach(card => {
        player1CardsDiv.innerHTML += getCardHTML(card); 
    });

    player2.deck.forEach(card => {
        player2CardsDiv.innerHTML += getCardHTML(card);
    });
}

function updateSelectableCards(revealedCards) {
    let selectableCardsDiv = document.querySelector('#selection-arena .card-tiler-div');
    selectableCardsDiv.innerHTML = ''; // clear the div
    revealedCards.forEach(card => {
        selectableCardsDiv.innerHTML += getCardHTML(card, selectable=true);
    });
}

function updateBudgets() {
    let player1Budget = document.querySelector('#player1-info #budget');
    let player2Budget = document.querySelector('#player2-info #budget');

    player1Budget.innerHTML = 'Budget: ' + player1.budget;
    player2Budget.innerHTML = 'Budget: ' + player2.budget;
}

function updateScores() {
    let player1Score = document.querySelector('#player1-info #score');
    let player2Score = document.querySelector('#player2-info #score');

    player1Score.innerHTML = 'Score: ' + player1.score;
    player2Score.innerHTML = 'Score: ' + player2.score;
}

function updateRound(){
    let roundInfo = document.querySelector('#round-info');
    roundInfo.innerHTML = `Round #${round}/${max_rounds}`;
}

function updateTurn(currentPlayer){
    let turnInfo = document.querySelector('#turn-info');
    turnInfo.innerHTML = `${currentPlayer.name}'s turn`;
}

function updatePhase(phase){
    let phaseInfo = document.querySelector('#phase-info');
    if (phase === 'selection'){
        phaseInfo.innerHTML = `Pick Your Fighters!`;
    } else if (phase === 'matches'){
        phaseInfo.innerHTML = `Fight!`;
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
    let playButton = document.querySelector('#play-button');
    let scores = document.querySelectorAll('#score');
    let courtText = document.querySelector('#court-text');
    court.style.display = 'flex';
    playButton.style.display = 'block';
    courtText.style.display = 'block';
    scores.forEach(score => {
        score.style.display = 'block';
    });
}

///////////////////////////
///  Listener Functions ///
///////////////////////////

function waitForSelection(){
    return new Promise ((resolve) => {
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

function chooseCardForMatch(currentPlayer){
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

///////////////////////////
/////  Game Functions ////
//////////////////////////


function generateCards(){
    let cards = [];
    let length = ALL_CARDS.length;
    for (let i = 0; i < 2*max_rounds; i++){ 
        cards.push(ALL_CARDS[Math.floor(Math.random() * length)]);
    }
    return cards;
}
function applySelection(player, selectedCard, opponentCard){
    let opponent = getOpponent(player);
    if (selectedCard.strength <= player.budget){
        console.log(`${player.name} selected ${selectedCard.name}`)
        player.deck.push(selectedCard);
        player.budget -= selectedCard.strength;
        let idx = cards.indexOf(selectedCard);
        if (idx > -1) {
            cards.splice(idx, 1);
        }
    }
    if (opponentCard.strength <= opponent.budget) {
        console.log(`${opponent.name} gets ${opponentCard.name}`)
        opponent.deck.push(opponentCard);
        opponent.budget -= opponentCard.strength;
        let idx = cards.indexOf(opponentCard);
        if (idx > -1) {
            cards.splice(idx, 1);
        }
    }else{
        console.log(`${opponent.name} passes`)
    }
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

function revealCards(currentPlayer){
    let filteredCards = cards.filter(card => card.strength <= currentPlayer.budget);

    if (filteredCards.length >= 2) {
        console.log("Two cards available");
        let idx1 = Math.floor(Math.random() * filteredCards.length);
        let card1 = filteredCards[idx1];

        let idx2 = idx1;
        while (idx2 === idx1){
            idx2 = Math.floor(Math.random() * filteredCards.length);
        }
        let card2 = filteredCards[idx2];

        return [card1, card2];
    } else if (filteredCards.length === 1){
        console.log("Only one card available");
        return filteredCards;
    } else if (filteredCards.length === 0){
        console.log("No cards left for this player, change turn to next player.")
        return [];
    }
}

let getOpponent = (currentPlayer) => (currentPlayer === player1) ? player2 : player1;

async function chooseCards(){
    let currentPlayer = player1;
    let finished = false;
    updateTurn(currentPlayer);
    updateBudgets();
    updateRound();
    while (!finished){
        let revealedCards = revealCards(currentPlayer);
        if (revealedCards.length === 0){
            // TODO: do something here 
            console.log("No cards left for this player, change turn to next player.")
            finished = true;
        } else if (revealedCards.length === 1){
            // TODO: do something here
            console.log("Only one card available");
            finished = true;
        } else {
            updateSelectableCards(revealedCards);
            let selection = await waitForSelection();
            if (selection === 'first'){
                applySelection(currentPlayer, revealedCards[0], revealedCards[1]);
            } else if (selection === 'second'){
                applySelection(currentPlayer, revealedCards[1], revealedCards[0]);
            }
            round = round+1;
            currentPlayer = getOpponent(currentPlayer);

            updatePlayerDecks();
            updateBudgets();
            updateAllCards();
            if (round > max_rounds){
                finished = true;
                console.log("Selection over");
                /* updatePhase('matches');
                hideSelection();
                round = 1;
                max_rounds = Math.min(player1.deck.length, player2.deck.length);
                updateRound(round, max_rounds);
                updateTurn(player1);
                playMatches(); */
            }else{
                updateRound(round, max_rounds);
                updateTurn(currentPlayer);
            }  
        }
    }
}

async function playMatches(){
    displayCourt();
    updateScores(player1, player2);
    let finished = false;
    let courtCard1 = document.querySelector('#court-card-1');
    let courtCard2 = document.querySelector('#court-card-2');
    let playButton = document.querySelector('#play-button');

    while (!finished){
        updateTurn(player1);
        let cardPlayer1 = await chooseCardForMatch(player1);
        courtCard1.innerHTML = cardPlayer1.innerHTML;
        courtCard1.style.display = 'block';

        updateTurn(player2);
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
                updatePlayerDecks(player1, player2);
                updateScores(player1, player2);
                // hide court
                let court = document.querySelector('#court');
                let courtText = document.querySelector('#court-text');
                let playButton = document.querySelector('#play-button');
                court.style.display = 'none';
                playButton.style.display = 'none';
                courtText.style.display = 'none';

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
            }else{
                updateRound(round, max_rounds);
            }

            playButton.removeEventListener('click', playButtonEventHandler);
        }
        playButton.addEventListener('click', playButtonEventHandler);

    }
}

function alertCardNotSelected(){
    let alertText = document.querySelector('#selection-alert');
    alertText.innerHTML = 'You cannot select this card. If you cannot select both cards, you must pass.';
}


