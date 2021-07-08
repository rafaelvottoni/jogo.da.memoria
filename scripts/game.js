let game = {
  lockMode: false, //se uma carta estiver aberta ela não pode ser clicada novamente e se tiver duas abertas nenhuma poderá ser aberta, então nesses momentos o lockMode será true
  firstCard: null, //a primeira carta aberta começa como vazio
  secondCard: null, //a segunda carta aberta começa como vazio também

  techs: [
    'bootstrap',
    'css',
    'electron',
    'firebase',
    'html',
    'javascript',
    'jquery',
    'mongo',
    'node',
    'react'
  ],

  setCard: function (id) {
    //setCard retorna verdadeiro ou falso
    let card = this.cards.filter(card => card.id === id)[0] //saber se a carta ta virada ou não. e essa função retornara todas cartas que tem o id igual ao id que eu cliquei. o filter retorna um array, então pegarei so o elemento de index 0 dele

    if (card.flipped || this.lockMode) {
      //se essa carta está virada retorna false:
      return false
    }

    if (!this.firstCard) {
      //se fistcard for nulo ele receberá o card clicado
      this.firstCard = card
      this.firstCard.flipped = true
      return true
    } else {
      //se a primeira cartão nao for null ele vai tentar colocar na segunda carta:
      this.secondCard = card
      this.secondCard.flipped = true
      this.lockMode = true //se colocar na segunda carta o jogo entra em lockMode
      return true
    }
  },

  checkMatch: function () {
    if (!this.firstCard || !this.secondCard) {
      //se não tiver primeira ou segunda carta ele retorna false
      return false
    }
    return this.firstCard.icon === this.secondCard.icon //vai retornar verdadeiro ou falso
  },

  clearCards: function () {
    this.firstCard = null
    this.secondCard = null
    this.lockMode = false
  },

  unflipCards: function () {
    //tirar o flip das cartas
    this.firstCard.flipped = false
    this.secondCard.flipped = false
    this.clearCards()
  },

  checkGameOver: function () {
    return this.cards.filter(card => !card.flipped).length === 0 //esse filter vai me retornar um array com todas as cartas que estão com flipped false, se o tamanho do array for 0 essa comparação vai ser true. e o checkGameOver será true.
  },

  cards: null, //não tem nada nas cartas antes de executar a função startGame

  //Criando cards para cada uma das techs do array techs:

  createCardsFromTechs: function () {
    this.cards = [] //cards será um array com outros 10 arrays dentro (pq são 10 techs), e cada um desses 10 arrays terão 2 objetos (os pares)

    this.techs.forEach(tech => {
      //pegando cada tech das minhas techs e criando um par
      this.cards.push(this.createPairFromTech(tech)) //vai adicionar ao array cards, o que essa função me entregar.
    })

    this.cards = this.cards.flatMap(pair => pair) //Eu nao quero cards como um array com 10 arrays, então a funçaõ flatMap desmembra esses arrays de dentro, fazendo cards ser um array com 20 objetos.
    this.shuffleCards()
    return this.cards
  },

  createPairFromTech: function (tech) {
    //ela vai retornar um array com dois objetos, o card e seu par
    return [
      {
        //o id será criado aleatoriamente e concatenado com o nome da tech, usando essa funçao:
        id: this.createIdWithTech(tech),
        icon: tech,
        //flipped me diz se a carta estara virada ou não
        flipped: false
      },
      {
        id: this.createIdWithTech(tech),
        icon: tech,
        flipped: false
      }
    ]
  },

  createIdWithTech: function (tech) {
    //a função vai retornar a tech em questão concatenada com o numeor aleatorio
    return tech + parseInt(Math.random() * 1000)
  },
  shuffleCards: function (cards) {
    //função para embaralhar as cartas de um array
    let currentIndex = this.cards.length //index da ultima carta do array (no caso cards)
    let randonIndex = 0 //index aleatorio do array

    while (currentIndex !== 0) {
      //enquanto currentIndex for diferente de 0 eu vou fazer isso:
      // o motivo de ser diferente de 0 é pq o lenght do array começa no 1 e o index começa no 0, então o ultimo item do array tera index 19 e o lenght do array sera 20.

      randonIndex = Math.floor(Math.random() * currentIndex) //eu so posso pegar cartas que não foram embaralhadas, então ele pega o math.random que da um valor de 0 até 1 e multiplicando pelo current index que foi a ultima carta a ser embaralhada, e o floor garante que o numero escolhido sera um anterior. se der 4.99 ele pega o 4.

      currentIndex--

      //Isso aqui vai pegar o cards com o index que foi criado aleatoriamnte e o current index da vez e troca-los de lugar dentro do array:
      ;[this.cards[randonIndex], this.cards[currentIndex]] = [
        this.cards[currentIndex],
        this.cards[randonIndex]
      ]
    }

    //pela a questão da referencia no javascript, nessa função não precisa retornar nada, pq ao passar o array cards para a função ela ja modifica o proprio array cards, ela não cria um novo array. tem um parte sobre referencias no material de javascript avançado. ele fala sobre modificar copias de array e com isso modificar o array original também
  }
}
