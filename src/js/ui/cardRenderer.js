// CardRenderer.js - Responsible for creating and styling card elements in the DOM

/**
 * Class that handles rendering playing cards to the UI
 */
export default class CardRenderer {
  /**
   * Creates a new DOM element representing a playing card
   * @param {Object} card - The card object containing suit and value properties
   * @returns {HTMLElement} A div element styled as a playing card
   */
  static createCardElement(card) {
      // Create the main card div element
      const cardDiv = document.createElement('div');
      
      // Set the card's suit as the visible text
      cardDiv.innerText = card.suit;
      
      // Add CSS classes:
      // - 'card' class for basic card styling
      // - color class ('red' or 'black') based on the suit
      cardDiv.classList.add("card", this.getColorClass(card));
      
      // Store the full card value (e.g. "K ♠") as a data attribute
      // This can be used for game logic or accessibility
      cardDiv.dataset.value = `${card.value} ${card.suit}`;
      
      return cardDiv;
  }

  /**
   * Determines the color class for a card based on its suit
   * @param {Object} card - The card object containing the suit
   * @returns {string} 'black' for clubs (♣) and spades (♠), 'red' for hearts (♥) and diamonds (♦)
   */
  static getColorClass(card) {
      // Clubs and spades are black, hearts and diamonds are red
      return card.suit === '♣' || card.suit === '♠' ? 'black' : 'red';
  }
}