const FRONT = 'card-front'
const BACK = 'card-back'
const CARD = 'card'
const ICON = 'icon'

startGame()

function startGame() {
  initializeCards(game.createCardsFromTechs()) //criando model visual da carta para cada uma das cards
}

function initializeCards(cards) {
  let gameBoard = document.getElementById('gameBoard') //pegando o tabuleiro no html

  gameBoard.innerHTML = '' //limpando o gameboard antes de adicionar as cartas

  game.cards.forEach(card => {
    //para todos os elementos sera criado um elemento no html, no caso é uma div, essa div vai receber um id que é o proprio id do card e a class card:
    let cardElement = document.createElement('div')
    cardElement.id = card.id
    cardElement.classList.add(CARD) //CARD variavel inicializada com uma string 'card'
    cardElement.dataset.icon = card.icon //vai adicionar um dataset icon no card (ex: data-icon="bootstrap" ) e esse dataset será igual ao icon de cada card
    createCardContent(card, cardElement)

    cardElement.addEventListener('click', flipCard) //adicionando o evento de clique a todas as cartas que executará a função flipCard
    gameBoard.appendChild(cardElement) //adicionando cada elemento dentro do tabuleiro, colocando "filhos" dentro do pai gameBoard
  })
}

function createCardContent(card, cardElement) {
  createCardFace(FRONT, card, cardElement)
  createCardFace(BACK, card, cardElement)
}

function createCardFace(face, card, element) {
  //criando as divs de frente e verso das cartas
  let cardElementFace = document.createElement('div') //vai criar a div dentro da card
  cardElementFace.classList.add(face) //adicionar a classe

  if (face == FRONT) {
    //se a face for front adiciona a imagem
    let iconElement = document.createElement('img')
    iconElement.classList.add(ICON) //variavel criada no inicio do codigo também
    iconElement.src = './assets/images/' + card.icon + '.png' //concatenação, para o endereço da imagem, o icon tem o mesmo nome da imagem e é uma das propriedades do objeto card (id, icon e flipped)
    cardElementFace.appendChild(iconElement)
  } else {
    //senão adiciona esse texto
    cardElementFace.innerHTML = '&lt/&gt'
  }

  element.appendChild(cardElementFace)
}

function flipCard() {
  if (game.setCard(this.id)) {
    //se conseguir colocar a carta ele executa o classList.add
    this.classList.add('flip')
    //flipa a carta que eu clicar

    if (game.secondCard) {
      //apenas se eu tiver a secondCard que farei isso:
      if (game.checkMatch()) {
        //se checkMatch for verdadeiro executa o clearcards
        game.clearCards()
        if (game.checkGameOver()) {
          let gameOverLayer = document.getElementById('gameOver')
          gameOverLayer.style.display = 'flex' //mudar o display do gameOver para flex. ele está none
        }
      } else {
        //acrescentando um intervalo para executar essa função
        setTimeout(() => {
          let firstCardView = document.getElementById(game.firstCard.id)
          let secondCardView = document.getElementById(game.secondCard.id)

          firstCardView.classList.remove('flip') //remover a class flip
          secondCardView.classList.remove('flip')
          game.unflipCards() //executa o flipcards que também executa um clearcards
          game.clearCards() //executa o clear cards
        }, 800)
      }
    }
  }
}

function restart() {
  game.clearCards()
  startGame()
  let gameOverLayer = document.getElementById('gameOver')
  gameOverLayer.style.display = 'none' //mudar o display do gameOver para none. ele está flex
}
