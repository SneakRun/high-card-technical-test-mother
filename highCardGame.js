import { GAME_EVENTS, gameEvents } from './gameEvents.js';
import Deck from './deck.js';

export const CARD_VALUE_MAP = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
    '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export class HighCardGame {
    constructor() {
        this.playerDeck = null;
        this.computerDeck = null;
        this.inRound = false;
        this.playerWins = 0;
        this.computerWins = 0;
        this.gameOverState = false;
    }

    startGame(deck) {
        deck.shuffle();
        const deckMidpoint = Math.ceil(deck.numberOfCards / 2);
        this.playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
        this.computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards));
        this.inRound = false;
        this.gameOverState = false;
        this.playerWins = 0;
        this.computerWins = 0;
    }

    flipCards() {
        this.inRound = true;
        const computerCard = this.computerDeck.pop();
        const playerCard = this.playerDeck.pop();
        
        gameEvents.emit(GAME_EVENTS.UPDATE_UI, { playerCard, computerCard });
        
        const winner = this.declareWinner(playerCard, computerCard);
        if (winner) this.updateScore(winner);
        
        if (this.isGameOver()) {
            this.gameOverState = true;
        }
        
        gameEvents.emit(GAME_EVENTS.ROUND_END, { winner });
    }

    declareWinner(cardOne, cardTwo) {
        const playerValue = CARD_VALUE_MAP[cardOne.value];
        const computerValue = CARD_VALUE_MAP[cardTwo.value];
        
        if (playerValue > computerValue) return 'Player';
        if (playerValue < computerValue) return 'Computer';
        return null;
    }

    updateScore(winner) {
        if (winner === 'Player') this.playerWins++;
        else if (winner === 'Computer') this.computerWins++;
        return { playerWins: this.playerWins, computerWins: this.computerWins };
    }

    cleanBeforeRound() {
        this.inRound = false;
    }

    isGameOver() {
        return this.playerDeck.numberOfCards === 0 || 
               this.computerDeck.numberOfCards === 0;
    }

    getGameState() {
        return {
            playerDeckCount: this.playerDeck?.numberOfCards || 0,
            computerDeckCount: this.computerDeck?.numberOfCards || 0,
            playerWins: this.playerWins,
            computerWins: this.computerWins,
            inRound: this.inRound,
            gameOverState: this.gameOverState
        };
    }
}