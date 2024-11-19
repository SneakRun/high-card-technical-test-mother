import { gameEvents, GAME_EVENTS } from '../../src/js/events/gameEvents.js';

describe('GameEvents', () => {
    beforeEach(() => {
        // Clear all event listeners before each test
        gameEvents.listeners = new Map();
    });

    test('should register event listener', () => {
        const callback = jest.fn();
        gameEvents.on(GAME_EVENTS.USER_ACTION, callback);
        expect(gameEvents.listeners.get(GAME_EVENTS.USER_ACTION)).toContain(callback);
    });

    test('should emit event to registered listeners', () => {
        const callback = jest.fn();
        const testData = { test: 'data' };
        gameEvents.on(GAME_EVENTS.USER_ACTION, callback);
        gameEvents.emit(GAME_EVENTS.USER_ACTION, testData);
        expect(callback).toHaveBeenCalledWith(testData);
    });

    test('should handle multiple listeners for same event', () => {
        const callback1 = jest.fn();
        const callback2 = jest.fn();
        gameEvents.on(GAME_EVENTS.SCORE_UPDATE, callback1);
        gameEvents.on(GAME_EVENTS.SCORE_UPDATE, callback2);
        gameEvents.emit(GAME_EVENTS.SCORE_UPDATE, { score: 10 });
        expect(callback1).toHaveBeenCalled();
        expect(callback2).toHaveBeenCalled();
    });

    test('should remove specific event listener', () => {
        const callback = jest.fn();
        gameEvents.on(GAME_EVENTS.GAME_OVER, callback);
        gameEvents.off(GAME_EVENTS.GAME_OVER, callback);
        gameEvents.emit(GAME_EVENTS.GAME_OVER, {});
        expect(callback).not.toHaveBeenCalled();
    });
});