// Import the Deck class from the deck.js file
import Deck from './deck.js';

const CARD_VALUE_MAP = {
    '2': 2,
    '3': 3,
    '4': 4,
    '5': 5,
    '6': 6,
    '7': 7,
    '8': 8,
    '9': 9,
    '10': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14,
}

// Select the computer card slot element
const computerCardSlot = document.querySelector('.computer-card-slot');
const playerCardSlot = document.querySelector('.player-card-slot');
const computerDeckElement = document.querySelector('.computer-deck');
const playerDeckElement = document.querySelector('.player-deck');
const text = document.querySelector('.text');

let playerDeck, computerDeck, inRound;

document.addEventListener('click', () => {
    if (inRound) {
        cleanBeforeRound();
    } else {
        flipCards();
    }
});

startGame();
function startGame() {
  // Create a new Deck instance and shuffle the cards
  const deck = new Deck();
  deck.shuffle();

  // Split the deck into two halves
  const deckMidpoint = Math.ceil(deck.numberOfCards / 2);
  playerDeck = new Deck(deck.cards.slice(0, deckMidpoint));
  computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards));
  inRound = false;


  cleanBeforeRound();
  console.log(playerDeck.numberOfCards);
  console.log(computerDeck.numberOfCards);
}

function flipCards() {
    inRound = true;

    const computerCard = computerDeck.pop();
    const playerCard = playerDeck.pop();

    // Append the cards to the card slots
    playerCardSlot.appendChild(playerCard.getHTML());
    computerCardSlot.appendChild(computerCard.getHTML());

    updateDeckCount();

    // Declare the winner of the round based on the card values
    if(declareWinner(playerCard, computerCard) === 'Player'){
        text.innerText = 'Player wins!';
    } else if (declareWinner(playerCard, computerCard) === 'Computer') {
        text.innerText = 'Computer wins!';
    } else {
        text.innerText = 'Draw!';
    }
}

// Function to clean up the game board before a new round
function cleanBeforeRound() {
    // Reset the inRound flag
    inRound = false;

    // Clear the text and the card slots
    text.innerText = '';
    computerCardSlot.innerHTML = '';
    playerCardSlot.innerHTML = '';

    // Update the deck count
    updateDeckCount();

    // Check if game is over
    if (isGameOver()) {
        if (playerDeck.numberOfCards > computerDeck.numberOfCards) {
            text.innerText = 'Player wins the game!';
        } else {
            text.innerText = 'Computer wins the game!';
        }
    }
}

// Add this helper function
function isGameOver() {
    return playerDeck.numberOfCards === 0 || computerDeck.numberOfCards === 0;
}

// Function to update the deck count
function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards;
    playerDeckElement.innerText = playerDeck.numberOfCards;
}

// Function to declare the winner of the round
function declareWinner(cardOne, cardTwo) {
    if (CARD_VALUE_MAP[cardOne.value] > CARD_VALUE_MAP[cardTwo.value]) {
        return 'Player';
    } else {
        return 'Computer';
    }
}
