// Card class to represent individual cards
class Card {
    // Initialising cards with suit and rank
    constructor(suit, rank) {
        this.suit = suit;
        this.rank = rank;
    }

    getValue() {
        // Create a mapping of card ranks to their numeric values
        // (Face cards have higher values: Jack = 11, Queen = 12, King = 13
        // Ace is highest with value of 14
        const values = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
            '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        return values[this.rank];
    }
}

// Game class
class Game {
    // Game implementation
}

// UI Functions
function updateUI(playerCard, computerCard, result) {
    // UI update logic
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Game initialization and event handling
});

//account for deck running out of cards

//account for reset function

//account for new game button
