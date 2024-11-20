// Import required modules
import CardRenderer from './cardRenderer.js';
import { gameEvents, GAME_EVENTS } from '../events/gameEvents.js';

export class UIManager {
    // Initialize UI elements and event listeners
    constructor() {
        // Get references to DOM elements
        this.computerCardSlot = document.querySelector('.computer-card-slot');
        this.playerCardSlot = document.querySelector('.player-card-slot');
        this.computerDeckElement = document.querySelector('.computer-deck');
        this.playerDeckElement = document.querySelector('.player-deck');
        this.text = document.querySelector('.text');
        this.computerScoreElement = document.querySelector('.computer-score');
        this.playerScoreElement = document.querySelector('.player-score');
        
        this.initializeEventListeners();
    }

    // Set up event listeners for game events
    initializeEventListeners() {
        gameEvents.on(GAME_EVENTS.UPDATE_UI, this.handleUpdateUI.bind(this));
        gameEvents.on(GAME_EVENTS.ROUND_END, this.handleRoundEnd.bind(this));
        gameEvents.on(GAME_EVENTS.GAME_OVER, this.handleGameOver.bind(this));
        gameEvents.on(GAME_EVENTS.SCORE_UPDATE, this.handleScoreUpdate.bind(this));
    }

    // Handle updating the UI with new card plays
    handleUpdateUI({ playerCard, computerCard }) {
        return new Promise(resolve => {
            // Create and display player's card if present
            if (playerCard) {
                const playerCardElement = CardRenderer.createCardElement(playerCard);
                this.playerCardSlot.appendChild(playerCardElement);
            }
            // Create and display computer's card if present
            if (computerCard) {
                const computerCardElement = CardRenderer.createCardElement(computerCard);
                this.computerCardSlot.appendChild(computerCardElement);
            }
    
            // Wait for animation to complete (0.6s)
            setTimeout(resolve, 600);
        });
    }

    // Display message when a round ends
    handleRoundEnd({ winner }) {
        this.text.innerText = winner ? `${winner} wins!` : 'Draw!';
    }

    // Display message when the game is over
    handleGameOver({ winner }) {
        this.text.innerText = `${winner} wins the game!`;
    }

    // Update score display when score changes
    handleScoreUpdate({ playerWins, computerWins }) {
        this.updateScoreDisplay(playerWins, computerWins);
    }

    // Update the displayed deck counts
    updateDeckCount(playerCount, computerCount) {
        this.computerDeckElement.innerText = String(computerCount);
        this.playerDeckElement.innerText = String(playerCount);
    }

    // Update the win counts display
    updateScoreDisplay(playerWins, computerWins) {
        this.playerScoreElement.innerText = `Wins: ${playerWins}`;
        this.computerScoreElement.innerText = `Wins: ${computerWins}`;
    }

    // Clear all UI elements (cards and text)
    cleanUI() {
        this.text.innerText = '';
        this.computerCardSlot.innerHTML = '';
        this.playerCardSlot.innerHTML = '';
    }

    // Reset score displays to zero
    resetScores() {
        this.computerScoreElement.innerText = 'Wins: 0';
        this.playerScoreElement.innerText = 'Wins: 0';
    }
}