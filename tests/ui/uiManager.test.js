/**
 * @jest-environment jsdom
 */

import { UIManager } from '../../src/js/ui/uiManager.js';
import { gameEvents, GAME_EVENTS } from '../../src/js/events/gameEvents.js';
import CardRenderer from '../../src/js/ui/cardRenderer.js';
import { ANIMATIONS } from '../../src/js/config/animationConfig.js';

// Create a mock element factory function
const createMockElement = () => {
    const element = document.createElement('div');
    jest.spyOn(element.classList, 'add');
    jest.spyOn(element.classList, 'remove');
    jest.spyOn(element.classList, 'contains');
    return element;
};

// Mock CardRenderer
jest.mock('../../src/js/ui/cardRenderer.js', () => ({
    createCardElement: jest.fn().mockImplementation(() => createMockElement())
}));

describe('UIManager', () => {
  let ui;
  
  beforeEach(() => {
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
      jest.clearAllMocks();
    
      // Update the mock to return our mock element
    CardRenderer.createCardElement.mockImplementation(() => {
        const element = createMockElement();
        element.classList.add('card');
        return element;
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
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
        
        // Player card should be immediate
        expect(CardRenderer.createCardElement).toHaveBeenCalledWith(playerCard);
        
        // Advance timer for computer card
        jest.advanceTimersByTime(ANIMATIONS.duration.card * 1.5);
        
        expect(CardRenderer.createCardElement).toHaveBeenCalledTimes(2);
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
    test('should clean UI elements correctly', () => {
        document.querySelector('.text').innerText = 'Some text';
        document.querySelector('.computer-card-slot').innerHTML = '<div>Card</div>';
        document.querySelector('.player-card-slot').innerHTML = '<div>Card</div>';

        ui.cleanUI();
        
        expect(document.querySelector('.text').innerText).toBe('');
        expect(document.querySelector('.computer-card-slot').innerHTML).toBe('');
        expect(document.querySelector('.player-card-slot').innerHTML).toBe('');
    });
});

describe('Animation Handling', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('should add and remove flip animation class for player card', () => {
        const playerCard = { value: 'K', suit: '♥' };
        ui.handleUpdateUI({ playerCard });
        
        const playerCardElement = document.querySelector('.player-card-slot div');
        expect(playerCardElement.classList.contains(ANIMATIONS.classes.card.flip)).toBe(true);
        
        // Trigger animation end
        playerCardElement.dispatchEvent(new Event('animationend'));
        expect(playerCardElement.classList.contains(ANIMATIONS.classes.card.flip)).toBe(false);
    });

    test('should delay computer card animation', () => {
        const computerCard = { value: '5', suit: '♠' };
        ui.handleUpdateUI({ computerCard });
        
        // Should not exist immediately
        expect(document.querySelector('.computer-card-slot div')).toBeNull();
        
        // Advance timer
        jest.advanceTimersByTime(ANIMATIONS.duration.card * 1.5);
        
        const computerCardElement = document.querySelector('.computer-card-slot div');
        expect(computerCardElement).toBeTruthy();
        expect(computerCardElement.classList.contains(ANIMATIONS.classes.card.flip)).toBe(true);
    });
});
});