/**
 * @jest-environment jsdom
 */

import { UIManager } from '../../src/js/ui/uiManager.js';
import { gameEvents, GAME_EVENTS } from '../../src/js/events/gameEvents.js';
import CardRenderer from '../../src/js/ui/cardRenderer.js';

// Mock CardRenderer
jest.mock('../../src/js/ui/cardRenderer.js', () => ({
  createCardElement: jest.fn().mockReturnValue({
      classList: { add: jest.fn() }
  })
}));

describe('UIManager', () => {
  let ui;
  
  beforeEach(() => {
      document.body.innerHTML = `
          <div class="computer-deck deck">26</div>
          <div class="computer-card-slot card-slot"></div>
          <div class="score-container">
              <span class="score-label">Wins</span>
              <div class="computer-score">0</div>
          </div>
          <div class="text"></div>
          <div class="player-deck deck">26</div>
          <div class="player-card-slot card-slot"></div>
          <div class="score-container">
              <span class="score-label">Wins</span>
              <div class="player-score">0</div>
          </div>
      `;
      ui = new UIManager();
      jest.clearAllMocks();
    
      // Update the mock to return a real DOM element
    CardRenderer.createCardElement.mockImplementation(() => {
      const element = document.createElement('div');
      element.classList.add('card');
      return element;
    });
  });

  describe('Event Listeners', () => {
    test('should initialize event listeners', () => {
        const eventSpy = jest.spyOn(gameEvents, 'on');
        new UIManager();
        expect(eventSpy).toHaveBeenCalledTimes(4);
        expect(eventSpy).toHaveBeenCalledWith(GAME_EVENTS.UPDATE_UI, expect.any(Function));
        expect(eventSpy).toHaveBeenCalledWith(GAME_EVENTS.ROUND_END, expect.any(Function));
        expect(eventSpy).toHaveBeenCalledWith(GAME_EVENTS.GAME_OVER, expect.any(Function));
        expect(eventSpy).toHaveBeenCalledWith(GAME_EVENTS.SCORE_UPDATE, expect.any(Function));
    });
});

describe('Card Rendering', () => {
    test('should render player and computer cards', () => {
        const playerCard = { value: 'K', suit: '♥' };
        const computerCard = { value: '5', suit: '♠' };
        
        ui.handleUpdateUI({ playerCard, computerCard });
        
        expect(CardRenderer.createCardElement).toHaveBeenCalledTimes(2);
        expect(CardRenderer.createCardElement).toHaveBeenCalledWith(playerCard);
        expect(CardRenderer.createCardElement).toHaveBeenCalledWith(computerCard);
    });

    test('should handle rendering only player card', () => {
        const playerCard = { value: 'K', suit: '♥' };
        ui.handleUpdateUI({ playerCard });
        expect(CardRenderer.createCardElement).toHaveBeenCalledTimes(1);
        expect(CardRenderer.createCardElement).toHaveBeenCalledWith(playerCard);
    });
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

    test('should display game over message correctly', () => {
        ui.handleGameOver({ winner: 'Computer' });
        expect(document.querySelector('.text').innerText).toBe('Computer wins the game!');
    });
});

describe('UI Cleanup', () => {
    test('should clean UI elements correctly', done => {
        document.querySelector('.text').innerText = 'Some text';
        document.querySelector('.computer-card-slot').innerHTML = '<div class="card">Card</div>';
        document.querySelector('.player-card-slot').innerHTML = '<div class="card">Card</div>';

        ui.cleanUI();
        
        // Check text is cleared immediately
        expect(document.querySelector('.text').innerText).toBe('');
        
        // Check cards are cleared after animation
        setTimeout(() => {
            expect(document.querySelector('.computer-card-slot').innerHTML).toBe('');
            expect(document.querySelector('.player-card-slot').innerHTML).toBe('');
            done();
        }, 350); // Slightly longer than animation duration
    });
});

describe('Deck Animation', () => {
    test('should update deck styles with count', () => {
        ui.updateDeckCount(26, 13);
        
        const computerDeck = document.querySelector('.computer-deck');
        const playerDeck = document.querySelector('.player-deck');
        
        // Check text content
        expect(computerDeck.innerText).toBe('13');
        expect(playerDeck.innerText).toBe('26');
    });
});
});