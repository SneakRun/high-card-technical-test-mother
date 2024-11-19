import { HighCardGame } from '../../src/js/game/highCardGame.js';
import { CARD_VALUE_MAP } from '../../src/js/game/highCardGame.js';
import Deck from '../../src/js/game/deck.js';
import { gameEvents } from '../../src/js/events/gameEvents.js';

describe('HighCardGame', () => {
    let game;
    
    beforeEach(() => {
        game = new HighCardGame();
    });

    describe('Card Comparison', () => {
        test('should declare player as winner with higher card', () => {
            const playerCard = { value: 'K', suit: '♥' };
            const computerCard = { value: '5', suit: '♠' };
            expect(game.declareWinner(playerCard, computerCard)).toBe('Player');
        });

        test('should declare computer as winner with higher card', () => {
            const playerCard = { value: '4', suit: '♥' };
            const computerCard = { value: 'A', suit: '♠' };
            expect(game.declareWinner(playerCard, computerCard)).toBe('Computer');
        });

        test('should return null on equal cards', () => {
            const playerCard = { value: '10', suit: '♥' };
            const computerCard = { value: '10', suit: '♠' };
            expect(game.declareWinner(playerCard, computerCard)).toBeNull();
        });
    });

    describe('Game State Management', () => {
        test('should initialize with correct default state', () => {
            const state = game.getGameState();
            expect(state).toEqual({
                playerDeckCount: 0,
                computerDeckCount: 0,
                playerWins: 0,
                computerWins: 0,
                inRound: false,
                gameOverState: false
            });
        });

        test('should correctly start new game', () => {
            const deck = new Deck();
            game.startGame(deck);
            const state = game.getGameState();
            expect(state.playerDeckCount).toBe(26);
            expect(state.computerDeckCount).toBe(26);
            expect(state.inRound).toBe(false);
            expect(state.gameOverState).toBe(false);
        });

        test('should correctly handle round cleanup', () => {
            game.inRound = true;
            game.cleanBeforeRound();
            expect(game.inRound).toBe(false);
        });

        test('should detect game over when player deck is empty', () => {
            const deck = new Deck();
            game.startGame(deck);
            game.playerDeck.cards = [];
            expect(game.isGameOver()).toBe(true);
        });

        test('should detect game over when computer deck is empty', () => {
            const deck = new Deck();
            game.startGame(deck);
            game.computerDeck.cards = [];
            expect(game.isGameOver()).toBe(true);
        });
    });

    describe('Score Management', () => {
        test('should update player score correctly', () => {
            const scores = game.updateScore('Player');
            expect(scores).toEqual({ playerWins: 1, computerWins: 0 });
        });

        test('should update computer score correctly', () => {
            const scores = game.updateScore('Computer');
            expect(scores).toEqual({ playerWins: 0, computerWins: 1 });
        });

        test('should accumulate scores correctly', () => {
            game.updateScore('Player');
            game.updateScore('Player');
            game.updateScore('Computer');
            const state = game.getGameState();
            expect(state.playerWins).toBe(2);
            expect(state.computerWins).toBe(1);
        });
    });
});