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

// Add this at the top of script.js after imports
let isProcessing = false;

// Main click event listener for the game
// Controls game flow based on current state
document.addEventListener('click', async () => {
    if (isProcessing) return;
    
    isProcessing = true;
    const gameState = game.getGameState();
    
    try {
        if (gameState.gameOverState) {
            await startGame();
        } else if (!game.isGameOver()) {
            await gameEvents.emit(GAME_EVENTS.USER_ACTION, { inRound: gameState.inRound });
        }
    } finally {
        isProcessing = false;
    }
});

// Handle user actions during the game
gameEvents.on(GAME_EVENTS.USER_ACTION, async ({ inRound }) => {
    if (inRound) {
        game.cleanBeforeRound();
        await cleanBeforeRound();
    } else {
        await game.flipCards();
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
async function startGame() {
    const deck = new Deck();
    game.startGame(deck);
    ui.resetScores();
    await cleanBeforeRound();
}

/**
 * Prepares UI for next round:
 * 1. Cleans previous round's UI elements
 * 2. Updates deck counts
 * 3. If game is over, determines winner and emits game over event
 */
async function cleanBeforeRound() {
    ui.cleanUI();
    const gameState = game.getGameState();
    await ui.updateDeckCount(gameState.playerDeckCount, gameState.computerDeckCount);

    if (game.isGameOver()) {
        const gameState = game.getGameState();
        const winner = gameState.playerWins > gameState.computerWins ? 'Player' : 
                      gameState.computerWins > gameState.playerWins ? 'Computer' : 
                      'Draw';
        await gameEvents.emit(GAME_EVENTS.GAME_OVER, { winner });
    }
}
// Initialize the game when script loads
startGame();
