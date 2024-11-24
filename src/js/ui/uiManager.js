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
        this.playerTotalWinsElement = document.querySelector('.player-total-wins');
        this.computerTotalWinsElement = document.querySelector('.computer-total-wins');
        
        this.initializeEventListeners();
    }

    // Set up event listeners for game events
    initializeEventListeners() {
        gameEvents.on(GAME_EVENTS.UPDATE_UI, async (data) => await this.handleUpdateUI(data));
        gameEvents.on(GAME_EVENTS.ROUND_END, async (data) => await this.handleRoundEnd(data));
        gameEvents.on(GAME_EVENTS.GAME_OVER, async (data) => await this.handleGameOver(data));
        gameEvents.on(GAME_EVENTS.SCORE_UPDATE, async (data) => await this.handleScoreUpdate(data));
        gameEvents.on(GAME_EVENTS.MILESTONE_REACHED, async (data) => await this.handleMilestoneReached(data));
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
    async handleRoundEnd({ winner }) {
        this.text.innerText = winner ? `${winner} wins!` : 'Draw!';
    }

    // Display message when the game is over
    async handleGameOver({ winner }) {
        this.text.innerText = `${winner} wins the game!`;
    }

    // Update score display when score changes
    async handleScoreUpdate({ playerWins, computerWins }) {
        this.updateScoreDisplay(playerWins, computerWins);
    }

    // Update the displayed deck counts
    async updateDeckCount(playerCount, computerCount) {
        // Update numbers
        this.computerDeckElement.innerText = String(computerCount);
        this.playerDeckElement.innerText = String(playerCount);
        
        // Update shadows
        const computerShadow = this.calculateShadowSize(computerCount);
        const playerShadow = this.calculateShadowSize(playerCount);
        
        this.computerDeckElement.style.boxShadow = `
            ${computerShadow}px ${computerShadow}px ${computerShadow * 2}px var(--shadow-dark),
            -${computerShadow}px -${computerShadow}px ${computerShadow * 2}px var(--shadow-light)
        `;
        
        this.playerDeckElement.style.boxShadow = `
            ${playerShadow}px ${playerShadow}px ${playerShadow * 2}px var(--shadow-dark),
            -${playerShadow}px -${playerShadow}px ${playerShadow * 2}px var(--shadow-light)
        `;
    }

    // Update the win counts display
    updateScoreDisplay(playerWins, computerWins) {
        this.playerScoreElement.innerText = String(playerWins);
        this.computerScoreElement.innerText = String(computerWins);
    }

    // Update the total win counts display
    updateTotalWins(playerTotal, computerTotal) {
        this.playerTotalWinsElement.innerText = String(playerTotal);
        this.computerTotalWinsElement.innerText = String(computerTotal);
    }

    // Clear all UI elements (cards and text)
    async cleanUI() {
        this.text.innerText = '';
        
        // Get all cards currently in play
        const cards = [...this.computerCardSlot.children, ...this.playerCardSlot.children];
        
        // If there are cards, animate them out
        if (cards.length > 0) {
            // Remove any existing exit animations
            cards.forEach(card => {
                card.classList.remove('card-exit');
                // Force a reflow to ensure animation plays
                void card.offsetWidth;
                card.classList.add('card-exit');
            });

            // Clear slots after animation
            setTimeout(() => {
                this.computerCardSlot.innerHTML = '';
                this.playerCardSlot.innerHTML = '';
            }, 300); // Match animation duration
        }
    }

    // Reset score displays to zero
    resetScores() {
        this.computerScoreElement.innerText = '0';
        this.playerScoreElement.innerText = '0';
    }

    // Add to UIManager class
    calculateShadowSize(cardCount) {
        // Max shadow at 26 cards (full deck), min at 0
        const maxShadow = 8;
        const minShadow = 0;
        const shadowSize = Math.max(
            minShadow,
            (cardCount / 26) * maxShadow
        );
        return shadowSize;
    }
}