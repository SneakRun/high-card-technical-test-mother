import { HighCardGame } from '../../src/js/game/highCardGame.js';
import { CARD_VALUE_MAP } from '../../src/js/game/highCardGame.js';

describe('HighCardGame', () => {
    let game;
    
    beforeEach(() => {
        game = new HighCardGame();
    });

    test('should correctly declare winner with higher card', () => {
        const playerCard = { value: 'K', suit: '♥' };
        const computerCard = { value: '5', suit: '♠' };
        
        const winner = game.declareWinner(playerCard, computerCard);
        expect(winner).toBe('Player');
    });
});