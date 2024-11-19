// cardRenderer.js
export default class CardRenderer {
  static createCardElement(card) {
      const cardDiv = document.createElement('div');
      cardDiv.innerText = card.suit;
      cardDiv.classList.add("card", this.getColorClass(card));
      cardDiv.dataset.value = `${card.value} ${card.suit}`;
      return cardDiv;
  }

  static getColorClass(card) {
      return card.suit === '♣' || card.suit === '♠' ? 'black' : 'red';
  }
}