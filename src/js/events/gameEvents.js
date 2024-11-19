/**
 * GameEventEmitter class implements a simple event system for the card game
 * It allows components to subscribe to events and be notified when those events occur
 */
class GameEventEmitter {
    /**
     * Initialize empty Map to store event listeners
     * Map keys are event names and values are arrays of callback functions
     */
    constructor() {
        this.listeners = new Map();
    }

    /**
     * Subscribe a callback function to an event
     * @param {string} event - Name of the event to listen for
     * @param {Function} callback - Function to call when event occurs
     */
    on(event, callback) {
        // Create empty array for this event type if it doesn't exist
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        // Add the callback to the array of listeners for this event
        this.listeners.get(event).push(callback);
    }

    /**
     * Emit an event to notify all subscribers
     * @param {string} event - Name of the event that occurred
     * @param {*} data - Optional data to pass to the callback functions
     */
    emit(event, data) {
        // If this event has listeners, call each callback with the event data
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }

    /**
     * Unsubscribe a callback function from an event
     * @param {string} event - Name of the event to unsubscribe from
     * @param {Function} callback - Function to remove from listeners
     */
    off(event, callback) {
        // Return early if event doesn't exist
        if (!this.listeners.has(event)) return;
        
        const listeners = this.listeners.get(event);
        const index = listeners.indexOf(callback);
        
        // Remove the callback if found
        if (index !== -1) {
            listeners.splice(index, 1);
        }
        
        // Clean up by removing empty listener arrays
        if (listeners.length === 0) {
            this.listeners.delete(event);
        }
    }
}

// Create and export a singleton instance of GameEventEmitter
// This ensures all components work with the same event system
const gameEvents = new GameEventEmitter();

/**
 * Constants for all possible game events
 * This helps prevent typos and makes it easier to track all possible events
 */
const GAME_EVENTS = {
    USER_ACTION: 'userAction',   // When user performs an action (like clicking)
    ROUND_END: 'roundEnd',       // When a round of the game ends
    GAME_OVER: 'gameOver',       // When the entire game is finished
    UPDATE_UI: 'updateUI',       // When the UI needs to be updated
    SCORE_UPDATE: 'scoreUpdate'  // When player scores change
};

export { gameEvents, GAME_EVENTS };