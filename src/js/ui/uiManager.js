// Import required modules
import CardRenderer from './cardRenderer.js';
import { gameEvents, GAME_EVENTS } from '../events/gameEvents.js';
import { ANIMATIONS } from '../config/animationConfig.js';

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
        // Create and display player's card if present
        if (playerCard) {
            const playerCardElement = CardRenderer.createCardElement(playerCard);
            playerCardElement.classList.add(ANIMATIONS.classes.card.flip);
            this.playerCardSlot.appendChild(playerCardElement);
            
            playerCardElement.addEventListener('animationend', () => {
                playerCardElement.classList.remove(ANIMATIONS.classes.card.flip);
            });
        }

        // Create and display computer's card if present
        if (computerCard) {
            setTimeout(() => {
                const computerCardElement = CardRenderer.createCardElement(computerCard);
                computerCardElement.classList.add(ANIMATIONS.classes.card.flip);
                this.computerCardSlot.appendChild(computerCardElement);
                
                // Listen for computer card animation end
                computerCardElement.addEventListener('animationend', () => {
                    computerCardElement.classList.remove(ANIMATIONS.classes.card.flip);
                    
                    // Add slight delay before showing results
                    setTimeout(() => {
                        // Emit event for score and message updates
                        gameEvents.emit(GAME_EVENTS.ROUND_COMPLETE, {
                            winner: this.determineWinner(playerCard, computerCard)
                        });
                    }, ANIMATIONS.duration.message / 2);
                });
            }, ANIMATIONS.duration.card * 1.5);
        }
    }

    // Display message when a round ends
    handleRoundEnd({ winner }) {
        this.text.innerText = winner ? `${winner} wins!` : 'Draw!';
        this.text.classList.add(ANIMATIONS.classes.message);
        this.text.addEventListener('animationend', () => {
            this.text.classList.remove(ANIMATIONS.classes.message);
        });
    }

    // Display message when the game is over
    handleGameOver({ winner }) {
        this.text.innerText = `${winner} wins the game!`;
    }

    // Update score display when score changes
    handleScoreUpdate({ playerWins, computerWins }) {
        this.updateScoreDisplay(playerWins, computerWins);
        this.playerScoreElement.classList.add(ANIMATIONS.classes.score);
        this.computerScoreElement.classList.add(ANIMATIONS.classes.score);
        
        const removeAnimation = (element) => {
            element.addEventListener('animationend', () => {
                element.classList.remove(ANIMATIONS.classes.score);
            });
        };
        
        removeAnimation(this.playerScoreElement);
        removeAnimation(this.computerScoreElement);
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