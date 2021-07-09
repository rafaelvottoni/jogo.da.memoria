let game = {
  lockMode: false,
  firstCard: null,
  secondCard: null,

  chars: [
    'c3po',
    'chewbacca',
    'darthvader',
    'hansolo',
    'leia',
    'luke',
    'obi',
    'r2d2',
    'stormtrooper',
    'yoda'
  ],

  setCard: function (id) {
    let card = this.cards.filter(card => card.id === id)[0]

    if (card.flipped || this.lockMode) {
      return false
    }

    if (!this.firstCard) {
      this.firstCard = card
      this.firstCard.flipped = true
      return true
    } else {
      this.secondCard = card
      this.secondCard.flipped = true
      this.lockMode = true
      return true
    }
  },

  checkMatch: function () {
    if (!this.firstCard || !this.secondCard) {
      return false
    }
    return this.firstCard.icon === this.secondCard.icon
  },

  clearCards: function () {
    this.firstCard = null
    this.secondCard = null
    this.lockMode = false
  },

  unflipCards: function () {
    this.firstCard.flipped = false
    this.secondCard.flipped = false
    this.clearCards()
  },

  checkGameOver: function () {
    return this.cards.filter(card => !card.flipped).length === 0
  },

  cards: null,

  createCardsFromChars: function () {
    this.cards = []

    this.chars.forEach(char => {
      this.cards.push(this.createPairFromChar(char))
    })

    this.cards = this.cards.flatMap(pair => pair)
    this.shuffleCards()
    return this.cards
  },

  createPairFromChar: function (char) {
    return [
      {
        id: this.createIdWithChar(char),
        icon: char,

        flipped: false
      },
      {
        id: this.createIdWithChar(char),
        icon: char,
        flipped: false
      }
    ]
  },

  createIdWithChar: function (char) {
    return char + parseInt(Math.random() * 1000)
  },
  shuffleCards: function (cards) {
    let currentIndex = this.cards.length
    let randonIndex = 0

    while (currentIndex !== 0) {
      randonIndex = Math.floor(Math.random() * currentIndex)
      currentIndex--
      ;[this.cards[randonIndex], this.cards[currentIndex]] = [
        this.cards[currentIndex],
        this.cards[randonIndex]
      ]
    }
  }
}
