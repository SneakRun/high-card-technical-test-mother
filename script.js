import Deck from './deck.js';
import CardRenderer from './cardRenderer.js';
import { gameEvents, GAME_EVENTS } from './gameEvents.js';
import { HighCardGame } from './highCardGame.js';

// DOM Elements
const computerCardSlot = document.querySelector('.computer-card-slot');
const playerCardSlot = document.querySelector('.player-card-slot');
const computerDeckElement = document.querySelector('.computer-deck');
const playerDeckElement = document.querySelector('.player-deck');
const text = document.querySelector('.text');
const computerScoreElement = document.querySelector('.computer-score');
const playerScoreElement = document.querySelector('.player-score');

const game = new HighCardGame();

// Event Handlers
document.addEventListener('click', () => {
    const gameState = game.getGameState();
    if (gameState.gameOverState) {
        startGame();
    } else if (!game.isGameOver()) {
        gameEvents.emit(GAME_EVENTS.USER_ACTION, { inRound: gameState.inRound });
    }
});

gameEvents.on(GAME_EVENTS.USER_ACTION, ({ inRound }) => {
    if (inRound) {
        game.cleanBeforeRound();
        cleanBeforeRound();
    } else {
        game.flipCards();
    }
});

gameEvents.on(GAME_EVENTS.ROUND_END, ({ winner }) => {
    text.innerText = winner ? `${winner} wins!` : 'Draw!';
    if (winner) {
        const scores = game.getGameState();
        updateScoreDisplay(scores);
    }
});

gameEvents.on(GAME_EVENTS.GAME_OVER, ({ winner }) => {
    text.innerText = `${winner} wins the game!`;
});

gameEvents.on(GAME_EVENTS.UPDATE_UI, ({ playerCard, computerCard }) => {
    if (playerCard) {
        const playerCardElement = CardRenderer.createCardElement(playerCard);
        playerCardSlot.appendChild(playerCardElement);
    }
    if (computerCard) {
        const computerCardElement = CardRenderer.createCardElement(computerCard);
        computerCardSlot.appendChild(computerCardElement);
    }
    updateDeckCount();
});

// UI Functions
function startGame() {
    const deck = new Deck();
    game.startGame(deck);
    
    computerScoreElement.innerText = 'Wins: 0';
    playerScoreElement.innerText = 'Wins: 0';
    
    cleanBeforeRound();
}

function cleanBeforeRound() {
    text.innerText = '';
    computerCardSlot.innerHTML = '';
    playerCardSlot.innerHTML = '';
    updateDeckCount();

    if (game.isGameOver()) {
        const gameState = game.getGameState();
        const winner = gameState.playerWins > gameState.computerWins ? 'Player' : 
                      gameState.computerWins > gameState.playerWins ? 'Computer' : 
                      'Draw';
        gameEvents.emit(GAME_EVENTS.GAME_OVER, { winner });
    }
}

function updateDeckCount() {
    const gameState = game.getGameState();
    computerDeckElement.innerText = gameState.computerDeckCount;
    playerDeckElement.innerText = gameState.playerDeckCount;
}

function updateScoreDisplay({ playerWins, computerWins }) {
    playerScoreElement.innerText = `Wins: ${playerWins}`;
    computerScoreElement.innerText = `Wins: ${computerWins}`;
}

// Start the game
startGame();