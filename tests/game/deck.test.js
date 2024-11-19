import Deck from '../../src/js/game/deck.js';

describe('Deck', () => {
    let deck;

    beforeEach(() => {
        deck = new Deck();
    });

    describe('Initialization', () => {
        test('should create a deck with 52 cards', () => {
            expect(deck.numberOfCards).toBe(52);
        });

        test('should have valid cards with suits and values', () => {
            const card = deck.cards[0];
            expect(card).toHaveProperty('suit');
            expect(card).toHaveProperty('value');
            expect(['♥', '♦', '♣', '♠']).toContain(card.suit);
            expect(['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']).toContain(card.value);
        });
    });

    describe('Card Operations', () => {
        test('should correctly pop a card', () => {
            const initialCount = deck.numberOfCards;
            const card = deck.pop();
            expect(deck.numberOfCards).toBe(initialCount - 1);
            expect(card).toHaveProperty('suit');
            expect(card).toHaveProperty('value');
        });

        test('should correctly push a card', () => {
            const card = deck.pop();
            const countAfterPop = deck.numberOfCards;
            deck.push(card);
            expect(deck.numberOfCards).toBe(countAfterPop + 1);
        });
    });

    describe('Shuffle Operation', () => {
        test('should maintain the same number of cards after shuffle', () => {
            const initialCount = deck.numberOfCards;
            deck.shuffle();
            expect(deck.numberOfCards).toBe(initialCount);
        });

        test('should change the order of cards', () => {
            const initialOrder = [...deck.cards];
            deck.shuffle();
            const shuffledOrder = deck.cards;
            expect(shuffledOrder).not.toEqual(initialOrder);
        });
    });
});