// Import event system and deck functionality
import { GAME_EVENTS, gameEvents } from '../events/gameEvents.js';
import Deck from './deck.js';

// Map card values to their numeric equivalents for comparison
// Ace is highest (14), followed by King (13), Queen (12), etc.
export const CARD_VALUE_MAP = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
    '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
};

export class HighCardGame {
    // Initialize game state variables
    constructor() {
        this.playerDeck = null;        // Player's deck of cards
        this.computerDeck = null;      // Computer's deck of cards
        this.inRound = false;          // Whether a round is currently in progress
        this.playerWins = 0;           // Number of rounds won by player
        this.computerWins = 0;         // Number of rounds won by computer
        this.gameOverState = false;    // Whether the game has ended
    }

    // Set up a new game with a fresh deck
    startGame(deck) {
        deck.shuffle();  // Randomize card order
        // Split deck evenly between player and computer
        const deckMidpoint = Math.ceil(deck.numberOfCards / 2);
        this.playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
        this.computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards));
        // Reset game state
        this.inRound = false;
        this.gameOverState = false;
        this.playerWins = 0;
        this.computerWins = 0;
    }

    // Execute one round of play
    flipCards() {
        this.inRound = true;
        // Both players draw top card from their deck
        const computerCard = this.computerDeck.pop();
        const playerCard = this.playerDeck.pop();
        
        // Notify UI to display the cards played
        gameEvents.emit(GAME_EVENTS.UPDATE_UI, { playerCard, computerCard });
        
        // Determine and handle round winner
        const winner = this.declareWinner(playerCard, computerCard);
        if (winner) this.updateScore(winner);
        
        // Check if game should end (when either deck is empty)
        if (this.isGameOver()) {
            this.gameOverState = true;
        }
        
        // Notify UI of round result
        gameEvents.emit(GAME_EVENTS.ROUND_END, { winner });
    }

    // Compare cards to determine round winner
    declareWinner(cardOne, cardTwo) {
        const playerValue = CARD_VALUE_MAP[cardOne.value];
        const computerValue = CARD_VALUE_MAP[cardTwo.value];
        
        if (playerValue > computerValue) return 'Player';
        if (playerValue < computerValue) return 'Computer';
        return null;  // Return null for a tie
    }

    // Update score after a round and notify UI
    updateScore(winner) {
        if (winner === 'Player') this.playerWins++;
        else if (winner === 'Computer') this.computerWins++;
        const scores = { playerWins: this.playerWins, computerWins: this.computerWins };
        gameEvents.emit(GAME_EVENTS.SCORE_UPDATE, scores);
        return scores;
    }

    // Reset round state for next round
    cleanBeforeRound() {
        this.inRound = false;
    }

    // Check if either player has run out of cards
    isGameOver() {
        return this.playerDeck.numberOfCards === 0 || 
               this.computerDeck.numberOfCards === 0;
    }

    // Return current game state for UI updates
    getGameState() {
        return {
            playerDeckCount: this.playerDeck?.numberOfCards || 0,    // Cards remaining in player's deck
            computerDeckCount: this.computerDeck?.numberOfCards || 0, // Cards remaining in computer's deck
            playerWins: this.playerWins,                             // Player's round wins
            computerWins: this.computerWins,                         // Computer's round wins
            inRound: this.inRound,                                   // Whether round is in progress
            gameOverState: this.gameOverState                        // Whether game has ended
        };
    }
}