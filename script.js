import Deck from './deck.js';
import { gameEvents, GAME_EVENTS } from './gameEvents.js';
import { HighCardGame } from './highCardGame.js';
import { UIManager } from './uiManager.js';

const game = new HighCardGame();
const ui = new UIManager();

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

gameEvents.on(GAME_EVENTS.UPDATE_UI, ({ playerCard, computerCard }) => {
    const gameState = game.getGameState();
    ui.updateDeckCount(gameState.playerDeckCount, gameState.computerDeckCount);
});

// Game Functions
function startGame() {
    const deck = new Deck();
    game.startGame(deck);
    ui.resetScores();
    cleanBeforeRound();
}

function cleanBeforeRound() {
    ui.cleanUI();
    const gameState = game.getGameState();
    ui.updateDeckCount(gameState.playerDeckCount, gameState.computerDeckCount);

    if (game.isGameOver()) {
        const gameState = game.getGameState();
        const winner = gameState.playerWins > gameState.computerWins ? 'Player' : 
                      gameState.computerWins > gameState.playerWins ? 'Computer' : 
                      'Draw';
        gameEvents.emit(GAME_EVENTS.GAME_OVER, { winner });
    }
}

// Start the game
startGame();