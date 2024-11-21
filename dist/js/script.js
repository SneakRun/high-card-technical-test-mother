// Import required game components
//this script is the main entry point for the game and will handle the game logic and state

//handles game logic and state  
import Deck from './game/deck.js';
//handles game events
import { gameEvents, GAME_EVENTS } from './events/gameEvents.js';
import { HighCardGame } from './game/highCardGame.js';
import { UIManager } from './ui/uiManager.js';

// Create instances of main game classes
const game = new HighCardGame();  // Handles game logic and state
const ui = new UIManager();       // Handles UI updates and rendering

// Main click event listener for the game
// Controls game flow based on current state
document.addEventListener('click', () => {
    const gameState = game.getGameState();
    if (gameState.gameOverState) {
        // If game is over, start a new game
        startGame();
    } else if (!game.isGameOver()) {
        // If game is still active, emit user action event with current round state
        gameEvents.emit(GAME_EVENTS.USER_ACTION, { inRound: gameState.inRound });
    }
});

// Handle user actions during the game
gameEvents.on(GAME_EVENTS.USER_ACTION, ({ inRound }) => {
    if (inRound) {
        // If we're in a round, clean up before starting next round
        game.cleanBeforeRound();
        cleanBeforeRound();
    } else {
        // If we're not in a round, flip cards to start new round
        game.flipCards();
    }
});

// Update UI when cards are flipped
gameEvents.on(GAME_EVENTS.UPDATE_UI, ({ playerCard, computerCard }) => {
    // Update the deck counts shown in UI
    const gameState = game.getGameState();
    ui.updateDeckCount(gameState.playerDeckCount, gameState.computerDeckCount);
});

// Game Functions

/**
 * Initializes a new game:
 * 1. Creates new deck
 * 2. Starts game with fresh deck
 * 3. Resets UI scores
 * 4. Cleans UI for new round
 */
function startGame() {
    const deck = new Deck();
    game.startGame(deck);
    ui.resetScores();
    cleanBeforeRound();
}

/**
 * Prepares UI for next round:
 * 1. Cleans previous round's UI elements
 * 2. Updates deck counts
 * 3. If game is over, determines winner and emits game over event
 */
function cleanBeforeRound() {
    ui.cleanUI();
    const gameState = game.getGameState();
    ui.updateDeckCount(gameState.playerDeckCount, gameState.computerDeckCount);

    if (game.isGameOver()) {
        const gameState = game.getGameState();
        // Determine winner based on number of wins
        const winner = gameState.playerWins > gameState.computerWins ? 'Player' : 
                      gameState.computerWins > gameState.playerWins ? 'Computer' : 
                      'Draw';
        gameEvents.emit(GAME_EVENTS.GAME_OVER, { winner });
    }
}

// Initialize the game when script loads
startGame();