// Import the Deck class from the deck.js file
import Deck from './deck.js';

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
  computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
  inRound = false;


  cleanBeforeRound();
  console.log(playerDeck.numberOfCards);
  console.log(computerDeck.numberOfCards);
}

function flipCards() {
    inRound = true;

    const computerCard = computerDeck.pop();
    const playerCard = playerDeck.pop();

    playerCardSlot.appendChild(playerCard.getHTML());
    computerCardSlot.appendChild(computerCard.getHTML());
}

function cleanBeforeRound() {
    inRound = false;
    text.innerText = '';
    computerCardSlot.innerHTML = '';
    playerCardSlot.innerHTML = '';

    updateDeckCount();
}

function updateDeckCount() {
    computerDeckElement.innerText = computerDeck.numberOfCards;
    playerDeckElement.innerText = playerDeck.numberOfCards;
}