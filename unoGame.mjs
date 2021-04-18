const COLORS = ['blue', 'yellow', 'red', 'green'];   /* Array of colors of the UNO game */
const NONCOLORRANKS = ['skip', 'reverse', 'draw2'];  /* Array of non number color cards */
const NONZERORANKS = [...Array(10).keys()].slice(1); /* Array of non zero ranks, the ones that are doubled */
const CARDSPERPLAYER = 7;

/* JS mod function is not valid in this situation because we need non-negative results. This new mod function solves it. */

const mod = (a, m) => {
    return ((a % m) + m) % m;
}

class Card {
    constructor(color, rank) {
        this.color = color;
        this.rank = rank;
    
    }

    get getColor() {
        return this.color;
    }

    get getRank() {
        return this.rank;
    }
}

class Deck {
    constructor() {
        this.deck = [];
        
        for(let color of COLORS) {
            for(let rank of NONZERORANKS){
                this.deck.push( new Card(color, rank) );
                this.deck.push( new Card(color, rank) );
            }
            this.deck.push( new Card(color, 0));
        }

        for(let color of COLORS) {
            for(let element of NONCOLORRANKS) {
                this.deck.push( new Card(color, element) );
                this.deck.push( new Card(color, element) );
            }
        }

        for(let i=1; i<= 4; i++) {
            this.deck.push( new Card('wild', 'wild') );
            this.deck.push( new Card('wild', 'draw4') );
        }

        this.length = this.deck.length;
    }
    
    shuffleDeck() {
        for(let i = this.deck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this.deck[i];
            this.deck[i] = this.deck[j];
            this.deck[j] = temp;
        }
    }

    drawCard() {
        this.deck.length--;
        return this.deck.pop();
    }
}



class Hand {
    constructor(player) {
        this.hand = [];
    }

    retrieveCard(card) {
        this.hand.push(card);
    }

    dealCard(card) {
        this.hand.splice(this.cards.indexOf(card), 1);
    }
}

class Player {
    constructor(playerName) {
        this.playerName = playerName;
        this.hand = [];
    }
}

class Game {
    constructor() {
        this.numplayers = 0;
        this.turn = 0; 
        this.players = []; 
        this.direction = 1;
        this.discard_pile = [];
    }

    addPlayer(playerName) {
        const player = new Player(playerName);
        this.players.push(player);
        this.numplayers++;
    }

    nextTurn() {
        this.turn = mod(direction*(this.turn + 1),this.numplayers);
    }

    startGame() {
        this.deck = new Deck();
        this.deck.shuffleDeck();
        this.dealCards();
    }

    dealCards() {
        for(let i=1; i <= CARDSPERPLAYER; i++) {
            for(let player of this.players) {
                player.hand.push(this.deck.drawCard())
            }
        }

        this.discard_pile.push(this.deck.deck.pop())
    }

    playerTurn(player, card) {
        if( this.discard_pile.deck.forEach( (card) => {
            return Compare.ableToPlay(this.discard_pile[this.discard_pile.length -1], card)
        }).every(elem => elem === false)) {
            player.hand.push(this.deck.deck.pop())
        } else {
            
        }
    }
}


/* Don't know how to construct abstract classes in JS, but this class should be abstract */

class Compare {
    constructor() {

    }

    static ableToPlay(card1, card2) {
        return (
            card1.color == card2.color ||
            card1.rank == card2.rank ||
            card2.color == 'wild'
        )
    }

}


const game = new Game();
game.addPlayer('Marc');
game.addPlayer('Raquel');
game.startGame();
console.log(game.deck.deck)


console.log(game.players);
console.log(game.discard_pile);