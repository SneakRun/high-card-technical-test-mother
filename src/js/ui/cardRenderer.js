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
    // Create the main card container div element
    const cardDiv = document.createElement('div');
    // Add 'card' class and color class (red/black) based on the card's suit
    cardDiv.classList.add("card", this.getColorClass(card), 'card-enter');
    
    // Create the top number/suit display
    const topNumber = document.createElement('div');
    // Add classes for styling the top value
    topNumber.classList.add('card-value', 'top');
    // Set the content to show the card's value and suit (e.g. "10♠")
    topNumber.textContent = `${card.value}${card.suit}`;
    
    // Create the center suit display
    const centerSuit = document.createElement('div');
    // Add class for styling the center suit
    centerSuit.classList.add('card-suit');
    // Set the content to just show the suit symbol (e.g. "♠")
    centerSuit.textContent = card.suit;
    
    // Add elements to card container
    cardDiv.appendChild(topNumber);
    cardDiv.appendChild(centerSuit);
    
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