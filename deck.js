// This script is used to create a deck of cards

const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Deck class to represent a deck of cards
// Built to account for a deck of any number of cards
export default class Deck {
  constructor(cards = createDeck()) {
    this.cards = cards;
  }

  // Getter method to get the number of cards in the deck
  get numberOfCards() {
    return this.cards.length;
  }

  // Method to shuffle the deck of cards
  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1));
      const oldValue = this.cards[newIndex];
      this.cards[newIndex] = this.cards[i];
      this.cards[i] = oldValue;
    }
  }
}

// Card class to represent an individual card
class Card {
  constructor(suit, value) {
    this.suit = suit;
    this.value = value;
  }
}

// Function to create a deck of cards
// Returns an array of Card instances
function createDeck() {
  return SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value);
    });
  });
}