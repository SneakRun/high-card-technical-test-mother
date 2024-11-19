class GameEventEmitter {
  constructor() {
      this.listeners = new Map();
  }

  on(event, callback) {
      if (!this.listeners.has(event)) {
          this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
  }

  emit(event, data) {
      if (this.listeners.has(event)) {
          this.listeners.get(event).forEach(callback => callback(data));
      }
  }

  // Optional: Add method to remove event listeners
  off(event, callback) {
      if (!this.listeners.has(event)) return;
      
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(callback);
      
      if (index !== -1) {
          listeners.splice(index, 1);
      }
      
      if (listeners.length === 0) {
          this.listeners.delete(event);
      }
  }
}

// Create and export a singleton instance
const gameEvents = new GameEventEmitter();

// Define available event types as constants
const GAME_EVENTS = {
  USER_ACTION: 'userAction',
  ROUND_END: 'roundEnd',
  GAME_OVER: 'gameOver',
  UPDATE_UI: 'updateUI',
  SCORE_UPDATE: 'scoreUpdate'
};

export { gameEvents, GAME_EVENTS };