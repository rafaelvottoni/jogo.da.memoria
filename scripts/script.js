const FRONT = 'card-front'
const BACK = 'card-back'
const CARD = 'card'
const ICON = 'icon'

let seconds = 0
let minutes = 0
let timeInSeconds = 0
let interval = null
let formatBestTime

let moves = 0
let formatMoves

const Timer = {
  updateBestTime: function () {
    let bestTimeHTML = document.querySelector('.best')
    let getBestTimeStorage = localStorage.getItem('time')

    let formatMinutes = Math.trunc(parseInt(getBestTimeStorage) / 60)

    let formatSeconds = Math.trunc(parseInt(getBestTimeStorage) % 60)

    if (formatMinutes < 10 && formatSeconds < 10) {
      formatBestTime = `0${formatMinutes}:0${formatSeconds}`
    } else if (formatMinutes < 10 && formatSeconds >= 10) {
      formatBestTime = `0${formatMinutes}:${formatSeconds}`
    } else if (formatMinutes >= 10 && formatSeconds < 10) {
      formatBestTime = `${formatMinutes}:0${formatSeconds}`
    } else {
      formatBestTime = `${formatMinutes}:${formatSeconds}`
    }

    let bestTimeStorage = getBestTimeStorage != null ? formatBestTime : '00:00'
    bestTimeHTML.innerHTML = bestTimeStorage
  },
  calculateTime: function () {
    if (minutes < 10) {
      document.getElementById('minutes').innerHTML = '0' + minutes
    }

    seconds++
    if (seconds == 60) {
      minutes++

      seconds = 0

      if (minutes < 10) {
        document.getElementById('minutes').innerHTML = '0' + minutes
      } else {
        document.getElementById('minutes').innerHTML = minutes
      }
    }

    if (seconds < 10) {
      document.getElementById('seconds').innerHTML = '0' + seconds
    } else {
      document.getElementById('seconds').innerHTML = seconds
    }
  },
  startTime: function () {
    interval = setInterval(this.calculateTime, 1000)
  },
  stopTime: function () {
    clearInterval(interval)

    timeInSeconds = minutes * 60 + seconds

    let getBestTimeStorage = localStorage.getItem('time')

    if (getBestTimeStorage == null || timeInSeconds < getBestTimeStorage) {
      localStorage.setItem('time', timeInSeconds)
    }

    setTimeout(this.updateBestTime, 50)

    minutes = 0

    seconds = 0
  },

  formatTimeForGameOverModal: function () {
    let timeFormated

    let formatMinutesGameOver = Math.trunc(parseInt(timeInSeconds) / 60)

    let formatSecondsGameOver = Math.trunc(parseInt(timeInSeconds) % 60)

    if (formatMinutesGameOver < 10 && formatSecondsGameOver < 10) {
      timeFormated = `0${formatMinutesGameOver}:0${formatSecondsGameOver}`
    } else if (formatMinutesGameOver < 10 && formatSecondsGameOver >= 10) {
      timeFormated = `0${formatMinutesGameOver}:${formatSecondsGameOver}`
    } else if (formatMinutesGameOver >= 10 && formatSecondsGameOver < 10) {
      timeFormated = `${formatMinutesGameOver}:0${formatSecondsGameOver}`
    } else {
      timeFormated = `${formatMinutesGameOver}:${formatSecondsGameOver}`
    }

    return timeFormated
  }
}

startGame()

function startGame() {
  Timer.updateBestTime()
  updateBestMoves()
  Timer.startTime()
  initializeCards(game.createCardsFromChars())
}

function initializeCards(cards) {
  let gameBoard = document.getElementById('gameBoard')

  gameBoard.innerHTML = ''

  game.cards.forEach(card => {
    let cardElement = document.createElement('div')
    cardElement.id = card.id
    cardElement.classList.add(CARD)
    cardElement.dataset.icon = card.icon
    createCardContent(card, cardElement)

    cardElement.addEventListener('click', flipCard)
    gameBoard.appendChild(cardElement)
  })
}

function createCardContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement)
  createCardFace(BACK, card, cardElement)
}

function createCardFace(face, card, element) {
  let cardElementFace = document.createElement('div')
  cardElementFace.classList.add(face)

  if (face == FRONT) {
    let iconElement = document.createElement('img')
    iconElement.classList.add(ICON)
    iconElement.src = './assets/images/' + card.icon + '.png'
    cardElementFace.appendChild(iconElement)
  } else {
    cardElementFace.innerHTML = `<div class="icon-back-div"><img class="icon-back" src="./assets/images/icon-back.png" /></div>`
  }

  element.appendChild(cardElementFace)
}

function flipCard() {
  let movesInHTML = document.querySelector('.number-of-moves')

  if (game.setCard(this.id)) {
    this.classList.add('flip')

    moves++
    formatMoves = Math.trunc(moves / 2)
    movesInHTML.innerHTML = formatMoves

    if (game.secondCard) {
      if (game.checkMatch()) {
        game.clearCards()
        if (game.checkGameOver()) {
          Timer.stopTime()
          setBestMovesInLocalStorage()

          let infoEndGame = document.querySelector('.info-endgame')
          infoEndGame.innerHTML = `${Timer.formatTimeForGameOverModal()} e ${formatMoves} movimentos`

          let gameOverLayer = document.querySelector('.gameOver')
          gameOverLayer.classList.add('show')
        }
      } else {
        setTimeout(() => {
          let firstCardView = document.getElementById(game.firstCard.id)
          let secondCardView = document.getElementById(game.secondCard.id)

          firstCardView.classList.remove('flip')
          secondCardView.classList.remove('flip')
          game.unflipCards()
          game.clearCards()
        }, 800)
      }
    }
  }
}

function restart() {
  game.clearCards()
  startGame()
  let movesInHTML = document.querySelector('.number-of-moves')
  movesInHTML.innerHTML = '0'
  let gameOverLayer = document.querySelector('.gameOver')
  gameOverLayer.classList.remove('show')
}

function updateBestMoves() {
  let bestMoveHTML = document.querySelector('.best-moves')
  let getBestTimeStorage = localStorage.getItem('moves')

  let bestMovesStorage = getBestTimeStorage != null ? getBestTimeStorage : 0

  bestMoveHTML.innerHTML = bestMovesStorage
}

function setBestMovesInLocalStorage() {
  let getBestMovesStorage = localStorage.getItem('moves')

  if (getBestMovesStorage == null || formatMoves < getBestMovesStorage) {
    localStorage.setItem('moves', formatMoves)
  }

  moves = 0
}
