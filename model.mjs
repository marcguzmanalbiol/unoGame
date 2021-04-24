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
    constructor() {
        this.hand = [];
    }

    dealCard(card) {
        this.hand.splice(this.hand.indexOf(card), 1);
    }
}
 
class Player {
    constructor(playerName) {
        this.playerName = playerName;
        this.hand = new Hand();
    }
}

export default class Game {
    constructor() {
        this.numplayers = 0;
        this.turn = 0; 
        this.players = []; 
        this.direction = 1;
        this.discard_pile = [];
    }

    addPlayer(playerName) {

        if (this.numplayers<=9) {
            const player = new Player(playerName);
            this.players.push(player);
            this.numplayers++;
        }

        else {
            console.log('Maximum players reached.')
        }
    }

    nextTurn() {
        this.turn = mod(this.direction + this.turn,this.numplayers);
    }

    startGame() {
        this.deck = new Deck();
        this.deck.shuffleDeck();
        this.dealCards();
    }

    dealCards() {
        for(let i=1; i <= CARDSPERPLAYER; i++) {
            for(let player of this.players) {
                player.hand.hand.push(this.deck.drawCard())
            }
        }

        this.discard_pile.push(this.deck.deck.pop())
    }

    playerTurn(player) {

        let played_card;
        let next_player; 

        if( this.deck.deck.length > 0 && player.hand.hand.map( (card) => {
            return Compare.ableToPlay(this.discard_pile[this.discard_pile.length -1], card);
        }).every(elem => elem === false)) {
            player.hand.hand.push(this.deck.deck.pop());
            console.log(`${player.playerName} draws a card. `)
        } 

        played_card = player.hand.hand.find( (card) => {
            return Compare.ableToPlay(this.discard_pile[this.discard_pile.length -1], card);
        });
        if (typeof played_card === 'undefined') {
            this.nextTurn()
            console.log(`${player.playerName} can not play any card. Next player is ${this.players[this.turn].playerName}`);
            return this.players[this.turn];
        } else {
            this.discard_pile.push(played_card);
            player.hand.dealCard(played_card);
        } 
        
        console.log(played_card)
        if( played_card.rank == 'reverse') {
            this.direction *= (-1);
        }

        if (played_card.rank == 'skip') {
            this.nextTurn();
            this.nextTurn();
            next_player = this.players[this.turn];
        } else {
            this.nextTurn();
            next_player = this.players[this.turn];
        }

        if ( played_card.rank == 'draw2') {
            next_player.hand.hand.push(...this.deck.deck.splice(-2,2));
        }

        if (played_card.rank == 'draw4') {
            next_player.hand.hand.push(...this.deck.deck.splice(-4,4));
        }

        console.log(`${player.playerName} played ${played_card.color}, ${played_card.rank}. Next player is ${next_player.playerName}`);

        if (player.hand.hand.length === 0) {
            next_player =  player;
            return next_player;
        } else {
            return next_player;
        }   
    }

    playGame() {
        
        let next_player;
        let current_player = this.players[this.turn];
        console.log(current_player);
        while(true) {
            next_player = this.playerTurn(current_player);
            if (current_player.hand.hand.length === 0) {
                console.log(`${current_player.playerName} win the game`);
                console.log(current_player.hand.hand);
                break;
            }
            current_player = next_player;
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
            card2.color == 'wild' ||
            card1.color == 'wild'
        ) 
    }

}

