const SHOT_MAX_COUNT = 10;
const BACKGROUND_STAR_MAX_COUNT = 100;
const BACKGROUND_STAR_MAX_SIZE = 3;
const BACKGROUND_STAR_MAX_SPEED = 4;
const SCREEN_WIDTH = 840;
const SCREEN_HEIGHT = 380;

let round = 1;
let timer = 10;
let isRunning = false;
// let gameState;
let isStart = false;
let barHeight;

let player1 = null;
let player2 = null;
let player1ShotArray = [];
let player2ShotArray = [];
let backgroundStarArray = [];

let player1Image = '/img/player1.png';
let player2Image = '/img/player2.png';
let shotImage = '/img/viper_shot.png';
let misakiFont = null;
const backgroundColor = "#121259";

let ctx;
let retryButton;

function setup() {
    let canvas = createCanvas(840, 480, P2D);
    canvas.parent('canvas');
    ctx = document.getElementById('defaultCanvas0').getContext('2d');
    textFont("arial black");
    gameState = "Programming";
    barHeight = height / 10;
    if (playerNum == 1) {
        aceEditor2.setOption("readOnly", true);
    } else if (playerNum == 2) {
        aceEditor1.setOption("readOnly", true);
    }
}

function draw() {
    if (isStart === true) {
        background(backgroundColor);
        backgroundStarArray.map((v) => {
            v.update();
        }); 
        
        player1.update();
        player2.update();
        player1ShotArray.map((v) => {
            v.update();
        });
        player2ShotArray.map((v) => {
            v.update();
        });

        if (player1State === true && player2State !== true) {
            textSize(24);
            text('Player1 Ready', 120, height/2);
        }
        if (player2State === true && player1State !== true) {
            textSize(24);
            text('player2 Ready', 120+width/2, height/2);
        }

        if (player1.life === 0 && player2.life === 0) {
            textSize(64);
            fill(255);
            text('Draw!\nPress R to Retry', width / 2 - 200, height / 2);
            finalize();
        } else if (player1.life === 0) {
            textSize(64);
            fill(player2Color);
            
            text('Player2 Win!\nPress R to Retry', width / 2 - 200, height / 2);
            finalize();
        } else if (player2.life == 0) {
            textSize(64);
            fill("blue");
            
            text('Player1 Win!\nPress R to Retry', width / 2 - 200, height /2);
            finalize();
        }
        
        fill(0);
        rect(0, 0, width, barHeight);
        rect(0, height - 50, width, barHeight);
        drawParameters();
    }
}

function drawParameters() {
    noStroke();
    textSize(18);
    fill(player1Color);
    stroke(255);
    if (player1.life < 200) {
        rect(5, height - 25, player1.life * 2, 20);
    } else {
        rect(5, height - 25, 400, 20);
    }
    
    noStroke();
    text("player1 Life", 5, height - 30);
    fill(player2Color);
    stroke(255);
    if (player2.life < 200) {
        rect(width / 2, height - 25, player2.life * 2, 20);
    } else {
        rect(width / 2, height - 25, 400, 20);
    }
    
    noStroke();
    text("player2 Life", width / 2, height - 30);
    fill(255);
    text("Round" + round, 5, 20);
    noFill();
    rect(80, 10, 200, 30, 5);
    textSize(24);
    fill("#FFC038");
    text(gameState, 90, 30);

    if (isRunning === true) {
        timer = 10 - Math.floor((Date.now() - startTime) / 1000);
    }
    textSize(32);
    fill(255);
    text(timer, width/2 - 20, 30);
}

function finalize() {
    gameState = "End";
    socket.emit('gameEnd', {
        'roomId': ss.roomId
    });
    noLoop();
}



