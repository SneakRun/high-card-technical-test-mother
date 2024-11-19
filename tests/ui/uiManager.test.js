import { UIManager } from '../../src/js/ui/uiManager.js';
import { gameEvents, GAME_EVENTS } from '../../src/js/events/gameEvents.js';

describe('UIManager', () => {
    let ui;
    
    beforeEach(() => {
        // Setup DOM elements
        document.body.innerHTML = `
            <div class="computer-deck deck">26</div>
            <div class="computer-card-slot card-slot"></div>
            <div class="computer-score">Wins: 0</div>
            <div class="text"></div>
            <div class="player-deck deck">26</div>
            <div class="player-card-slot card-slot"></div>
            <div class="player-score">Wins: 0</div>
        `;
        ui = new UIManager();
    });

    describe('Score Management', () => {
        test('should update score display correctly', () => {
            ui.updateScoreDisplay(2, 1);
            expect(document.querySelector('.player-score').innerText).toBe('Wins: 2');
            expect(document.querySelector('.computer-score').innerText).toBe('Wins: 1');
        });

        test('should reset scores correctly', () => {
            ui.updateScoreDisplay(5, 3);
            ui.resetScores();
            expect(document.querySelector('.player-score').innerText).toBe('Wins: 0');
            expect(document.querySelector('.computer-score').innerText).toBe('Wins: 0');
        });
    });

    describe('Deck Count Management', () => {
        test('should update deck counts correctly', () => {
            ui.updateDeckCount(20, 15);
            expect(document.querySelector('.player-deck').innerText).toBe('20');
            expect(document.querySelector('.computer-deck').innerText).toBe('15');
        });
    });

    describe('Game State Messages', () => {
        test('should display round end message correctly', () => {
            ui.handleRoundEnd({ winner: 'Player' });
            expect(document.querySelector('.text').innerText).toBe('Player wins!');
        });

        test('should display draw message correctly', () => {
            ui.handleRoundEnd({ winner: null });
            expect(document.querySelector('.text').innerText).toBe('Draw!');
        });

        test('should display game over message correctly', () => {
            ui.handleGameOver({ winner: 'Computer' });
            expect(document.querySelector('.text').innerText).toBe('Computer wins the game!');
        });
    });

    describe('UI Cleanup', () => {
        test('should clean UI elements correctly', () => {
            // Setup some content
            document.querySelector('.text').innerText = 'Some text';
            document.querySelector('.computer-card-slot').innerHTML = '<div>Card</div>';
            document.querySelector('.player-card-slot').innerHTML = '<div>Card</div>';

            ui.cleanUI();
            
            expect(document.querySelector('.text').innerText).toBe('');
            expect(document.querySelector('.computer-card-slot').innerHTML).toBe('');
            expect(document.querySelector('.player-card-slot').innerHTML).toBe('');
        });
    });
});