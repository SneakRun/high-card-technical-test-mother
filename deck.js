// This script is used to create a deck of cards

const SUITS = ['♥', '♦', '♣', '♠'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Deck class to represent a deck of cards
// Built to account for a deck of any number of cards
export default class Deck {
  constructor(cards = createDeck()) {
    this.cards = cards;
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