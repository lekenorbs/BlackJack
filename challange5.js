
//Challange 5: BLACKJACK

// blackjackgame database
let blackJackGame = {
    'you': {'spanScore': '#your_result', 'div':'#you', 'score':0},
    'dealer': { 'spanScore': '#dealer_result', 'div': '#dealer', 'score': 0 },
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'J', 'Q', 'A'],
    'cardValue': { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'K': 10, 'J': 10, 'Q': 10, 'A': [1, 11] },
    'wins': 0,
    'draws': 0,
    'losses': 0,
    'results': { 'wins': 0, 'draws': 0, 'wins': 0 },
    'isStand': false,
    'turnsOver': false,
}

// constants for accessing the blackJackGame database
const YOU = blackJackGame['you']
const DEALER = blackJackGame['dealer']

// create a sound element and pass the path of the sound
const hitSound = new Audio('soundsAndImages/sounds/swish.m4a');
const winSound = new Audio('soundsAndImages/sounds/cash.mp3');
const lostSound = new Audio('soundsAndImages/sounds/aww.mp3');

//Create evenListener to help us access each id element in the html
document.querySelector('#hit-button').addEventListener('click', hitButton);
document.querySelector('#stand-button').addEventListener('click', standButton);
document.querySelector('#deal-button').addEventListener('click', dealButton);

// The Hit button function to play
function hitButton() {
    if (blackJackGame['isStand'] === false) {
        let card = randomCards();
        displayCard(card, YOU);
        playSound();
        incrCard(card, YOU);
        showScore(YOU);
    }

}
//
//function helps us generates random cards to be displayed by displayCards function when we click the hitButton function
function randomCards() {
    let randomNum = Math.floor(Math.random() * 13);
    return blackJackGame['cards'][randomNum];
}


// function displays card in the hit button function
function displayCard(card, activePlayer) {
    if (activePlayer['score'] <= 21) {
        let cardImage = document.createElement('img');
        cardImage.src = `soundsAndImages/images/${card}.png`;
        document.querySelector(activePlayer['div']).appendChild(cardImage);
    }
}

//function playSound is used to play the sound
function playSound() {
    hitSound.play();
}

// the dealButton function to remove all cards
function dealButton() {
    removeCards();
}


// the removeCard function to remove all cards
function removeCards() {
    if (blackJackGame['turnsOver'] === true) {
        blackJackGame['isStand'] = false;
        let yourImages = document.querySelector('#you').querySelectorAll('img');
        let dealerImages = document.querySelector('#dealer').querySelectorAll('img');

        for (let i = 0; i < yourImages.length; i++) {
            yourImages[i].remove();
        }

        for (let i = 0; i < dealerImages.length; i++) {
            dealerImages[i].remove();
        }

        YOU['score'] = 0;
        DEALER['score'] = 0;

        document.querySelector('#your_result').textContent = 0;
        document.querySelector('#dealer_result').textContent = 0;
        document.querySelector('#your_result').style.color = 'white';
        document.querySelector('#dealer_result').style.color = 'white';
        document.querySelector('#blackjack').textContent = "Let's Play";
        document.querySelector('#blackjack').style.color = "black";
        blackJackGame['turnsOver'] = true;
    }

}

// function increments and updates the current score of both player and dealer
function incrCard(card, activePlayer) {
    // if adding 11 keeps me below or equal to 21, then add 11, else add 1.
    if (card === 'A'){
        if (activePlayer['score'] + blackJackGame['cardValue'][card][1] <= 21) {
            activePlayer['score'] += blackJackGame['cardValue'][card][1];
        }
        else {
            activePlayer['score'] += blackJackGame['cardValue'][card][0];
        }
    }
    // else just go ahead and add the card choosen. 
    else {
        activePlayer['score'] += blackJackGame['cardValue'][card];
    }
}

//function displays the scores
function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['spanScore']).textContent = 'BUSTED!!!';
        document.querySelector(activePlayer['spanScore']).style.color = 'red';
    }
    else {
        document.querySelector(activePlayer['spanScore']).textContent = activePlayer['score'];
    }
   
}
// creating a sleep function to call later. 
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// button displays cards for the robbot
// function is asynchronous because we want it to run after a specified period of time. 
async function standButton() {
    blackJackGame['isStand'] = true;
    while (DEALER['score'] < 17 && blackJackGame['isStand'] === true) {

        let card = randomCards();
        displayCard(card, DEALER);
        playSound();
        incrCard(card, DEALER);
        showScore(DEALER);
        await sleep(2000);
    }
        blackJackGame['turnsOver'] = true;
        let winner = computeWinner();
        showWinner(winner);
}

// function computes who winner
// function also updates the wins, draws and losses.

function computeWinner() {
    let winner;
    if (YOU['score'] <= 21) {
        if (YOU['score'] > DEALER['score'] || DEALER['score'] > 21) {
            blackJackGame['wins']++;
            winner = YOU;
        }
        else if (YOU['score'] < DEALER['score'] && DEALER['score'] <= 21) {
            blackJackGame['losses']++;
            winner = DEALER;
        }
        else if (YOU['score'] === DEALER['score']) {
            blackJackGame['draws']++;
        }

    } else if (YOU['score'] > 21 && DEALER['score'] <= 21) {
        blackJackGame['losses']++;
        winner = DEALER;
    }
    else if (YOU['score'] > 21 && DEALER['score'] > 21) {
        blackJackGame['draws']++;
    }
    return winner;
}

// function displays the winner.
function showWinner(winner) {
    let message, messagecolor;
    if (blackJackGame['turnsOver'] === true) {
        if (winner === YOU) {
            document.querySelector('#wins').textContent = blackJackGame['wins'];
            document.querySelector('#wins').style.color = 'green';
            message = 'You Win!!';
            messagecolor = 'green';
            winSound.play();
        }
        else if (winner === DEALER) {
            document.querySelector('#losses').textContent = blackJackGame['losses'];
            document.querySelector('#losses').style.color = 'red';
            message = 'You Lost';
            messagecolor = 'red';
            lostSound.play();
        }
        else {
            document.querySelector('#draws').textContent = blackJackGame['draws'];
            document.querySelector('#draws').style.color = 'orange';
            message = 'You Drew';
            messagecolor = 'black';
        }
        document.querySelector('#blackjack').textContent = message;
        document.querySelector('#blackjack').style.color = messagecolor;
    }
}


