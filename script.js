import Deck from './deck.js';

// Game constants
const CARD_VALUE_MAP = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
    '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

// DOM Elements
const computerCardSlot = document.querySelector('.computer-card-slot');
const playerCardSlot = document.querySelector('.player-card-slot');
const computerDeckElement = document.querySelector('.computer-deck');
const playerDeckElement = document.querySelector('.player-deck');
const text = document.querySelector('.text');
const computerScoreElement = document.querySelector('.computer-score');
const playerScoreElement = document.querySelector('.player-score');

// Game state
let playerDeck, computerDeck, inRound;
let playerWins = 0;
let computerWins = 0;

// Game Events
class GameEventEmitter {
    constructor() {
        this.listeners = new Map();
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

const gameEvents = new GameEventEmitter();

// Event Handlers
document.addEventListener('click', () => {
    gameEvents.emit('userAction', { inRound });
});

gameEvents.on('userAction', ({ inRound }) => {
    if (inRound) {
        cleanBeforeRound();
    } else {
        flipCards();
    }
});

gameEvents.on('roundEnd', ({ winner }) => {
    text.innerText = winner ? `${winner} wins!` : 'Draw!';
    if (winner) updateScore(winner);
});

gameEvents.on('gameOver', ({ winner }) => {
    text.innerText = `${winner} wins the game!`;
});

gameEvents.on('updateUI', ({ playerCard, computerCard }) => {
    if (playerCard) playerCardSlot.appendChild(playerCard.getHTML());
    if (computerCard) computerCardSlot.appendChild(computerCard.getHTML());
    updateDeckCount();
});

// Game Functions
function startGame() {
    const deck = new Deck();
    deck.shuffle();

    const deckMidpoint = Math.ceil(deck.numberOfCards / 2);
    playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
    computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards));
    inRound = false;

    playerWins = 0;
    computerWins = 0;
    computerScoreElement.innerText = 'Wins: 0';
    playerScoreElement.innerText = 'Wins: 0';

    cleanBeforeRound();
}

function flipCards() {
    inRound = true;

    const computerCard = computerDeck.pop();
    const playerCard = playerDeck.pop();

    gameEvents.emit('updateUI', { playerCard, computerCard });

    const winner = declareWinner(playerCard, computerCard);
    gameEvents.emit('roundEnd', { winner });
}

function cleanBeforeRound() {
    inRound = false;
    text.innerText = '';
    computerCardSlot.innerHTML = '';
    playerCardSlot.innerHTML = '';
    updateDeckCount();

    if (isGameOver()) {
        const winner = playerWins > computerWins ? 'Player' : 
                      computerWins > playerWins ? 'Computer' : 
                      'Draw';
        gameEvents.emit('gameOver', { winner });
    }
}

function isGameOver() {
    return playerDeck.numberOfCards === 0 || computerDeck.numberOfCards === 0;
}

function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards;
    playerDeckElement.innerText = playerDeck.numberOfCards;
}

function updateScore(winner) {
    if (winner === 'Player') {
        playerWins++;
        playerScoreElement.innerText = `Wins: ${playerWins}`;
    } else if (winner === 'Computer') {
        computerWins++;
        computerScoreElement.innerText = `Wins: ${computerWins}`;
    }
}

function declareWinner(cardOne, cardTwo) {
    const playerValue = CARD_VALUE_MAP[cardOne.value];
    const computerValue = CARD_VALUE_MAP[cardTwo.value];
    
    if (playerValue > computerValue) return 'Player';
    if (playerValue < computerValue) return 'Computer';
    return null;
}

// Start the game
startGame();