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
    // Returns a Promise that resolves after animations complete
    handleUpdateUI({ playerCard, computerCard }) {
        return new Promise(resolve => {
            // Handle player's card if one was played
            if (playerCard) {
                // Create and add the card element to the player's slot
                const playerCardElement = CardRenderer.createCardElement(playerCard);
                this.playerCardSlot.appendChild(playerCardElement);

                // After card appears (600ms), add glow effect
                setTimeout(() => {
                    // Set glow color based on suit - cyan for clubs/spades, pink for hearts/diamonds
                    const glowColor = playerCard.suit === '♣' || playerCard.suit === '♠' ? 
                        'var(--accent-black)' : 'var(--accent-red)';
                    playerCardElement.style.setProperty('--glow-color', glowColor);
                    // Add pulsing glow animation class
                    playerCardElement.classList.add('glow-pulse');
                }, 600);
            }

            // Handle computer's card if one was played
            if (computerCard) {
                // Create and add the card element to the computer's slot
                const computerCardElement = CardRenderer.createCardElement(computerCard);
                this.computerCardSlot.appendChild(computerCardElement);

                // After card appears (600ms), add glow effect
                setTimeout(() => {
                    // Set glow color based on suit - cyan for clubs/spades, pink for hearts/diamonds
                    const glowColor = computerCard.suit === '♣' || computerCard.suit === '♠' ? 
                        'var(--accent-black)' : 'var(--accent-red)';
                    computerCardElement.style.setProperty('--glow-color', glowColor);
                    // Add pulsing glow animation class
                    computerCardElement.classList.add('glow-pulse');
                }, 600);
            }

            // Resolve promise after animations complete (2100ms total)
            // This includes:
            // - 600ms for cards to appear
            // - 1500ms for glow pulse animation
            setTimeout(resolve, 2100);
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

    // Clear all UI elements (cards and text)
    cleanUI() {
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
        return Math.max(
            minShadow,
            (cardCount / 26) * maxShadow
        );
    }
}