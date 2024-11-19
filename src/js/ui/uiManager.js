import CardRenderer from './cardRenderer.js';
import { gameEvents, GAME_EVENTS } from '../events/gameEvents.js';

export class UIManager {
    constructor() {
        this.computerCardSlot = document.querySelector('.computer-card-slot');
        this.playerCardSlot = document.querySelector('.player-card-slot');
        this.computerDeckElement = document.querySelector('.computer-deck');
        this.playerDeckElement = document.querySelector('.player-deck');
        this.text = document.querySelector('.text');
        this.computerScoreElement = document.querySelector('.computer-score');
        this.playerScoreElement = document.querySelector('.player-score');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        gameEvents.on(GAME_EVENTS.UPDATE_UI, this.handleUpdateUI.bind(this));
        gameEvents.on(GAME_EVENTS.ROUND_END, this.handleRoundEnd.bind(this));
        gameEvents.on(GAME_EVENTS.GAME_OVER, this.handleGameOver.bind(this));
        gameEvents.on(GAME_EVENTS.SCORE_UPDATE, this.handleScoreUpdate.bind(this));
    }

    handleUpdateUI({ playerCard, computerCard }) {
        if (playerCard) {
            const playerCardElement = CardRenderer.createCardElement(playerCard);
            this.playerCardSlot.appendChild(playerCardElement);
        }
        if (computerCard) {
            const computerCardElement = CardRenderer.createCardElement(computerCard);
            this.computerCardSlot.appendChild(computerCardElement);
        }
    }

    handleRoundEnd({ winner }) {
        this.text.innerText = winner ? `${winner} wins!` : 'Draw!';
    }

    handleGameOver({ winner }) {
        this.text.innerText = `${winner} wins the game!`;
    }

    handleScoreUpdate({ playerWins, computerWins }) {
        this.updateScoreDisplay(playerWins, computerWins);
    }

    updateDeckCount(playerCount, computerCount) {
        this.computerDeckElement.innerText = computerCount;
        this.playerDeckElement.innerText = playerCount;
    }

    updateScoreDisplay(playerWins, computerWins) {
        this.playerScoreElement.innerText = `Wins: ${playerWins}`;
        this.computerScoreElement.innerText = `Wins: ${computerWins}`;
    }

    cleanUI() {
        this.text.innerText = '';
        this.computerCardSlot.innerHTML = '';
        this.playerCardSlot.innerHTML = '';
    }

    resetScores() {
        this.computerScoreElement.innerText = 'Wins: 0';
        this.playerScoreElement.innerText = 'Wins: 0';
    }
}