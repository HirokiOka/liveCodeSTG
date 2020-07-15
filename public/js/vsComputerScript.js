const SHOT_MAX_COUNT = 10;
const BACKGROUND_STAR_MAX_COUNT = 100;
const BACKGROUND_STAR_MAX_SIZE = 3;
const BACKGROUND_STAR_MAX_SPEED = 4;
const SCREEN_WIDTH = 840;
const SCREEN_HEIGHT = 380;

let round = 1;
let timer = 10;
let isRunning = false;
let gameState;
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
let explosionSound = null;
let winSound = null;
const backgroundColor = "#121259";

let keyInput;
let retryButton;

function setup() {
    let canvas = createCanvas(840, 480, P2D);
    canvas.parent('canvas');
    textFont("arial black");
    gameState = "Programming";
    barHeight = height / 10;
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
            fill('blue');
            text('Player1 Win!\nPress R to Retry', width / 2 - 200 , height /2);
            finalize();
        }
        
        fill(0);
        rect(0, 0, width, barHeight);
        rect(0, height - 50, width, barHeight);
        drawParameters();
    }
    keyInput = document.getElementById('checkbox').checked;
}

function drawParameters() {
    noStroke();
    textSize(18);
    fill(player1Color);
    stroke(255);
    rect(5, height - 25, player1.life * 2, 20);
    noStroke();
    text("player1 Life", 5, height - 30);
    fill(player2Color);
    stroke(255);
    rect(width / 2, height - 25, player2.life * 2, 20);
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

function createCharacter() {
    document.getElementById('startButton').disabled = true;
    eval(editor.getValue());
    player2 = new Fighter2();
    initialize();
}

function initialize() {

    document.getElementById('character-programming').style.display = 'none';
    document.getElementById('game').style.visibility = 'visible';

    player1.setVectorFromAngle(HALF_PI);
    player2.setVectorFromAngle(-HALF_PI);

    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        player1ShotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        player1ShotArray[i].setTarget(player2);
        player1ShotArray[i].setPower(player1.power);
        player2ShotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        player2ShotArray[i].setTarget(player1);
        player2ShotArray[i].setPower(player2.power);
    }

    player1.setShotArray(player1ShotArray);
    player2.setShotArray(player2ShotArray);


    for (let i = 0; i < BACKGROUND_STAR_MAX_COUNT; i++) {
        let size = random(1, BACKGROUND_STAR_MAX_SIZE);
        let speed = random(1, BACKGROUND_STAR_MAX_SPEED);

        backgroundStarArray[i] = new BackgroundStar(size, speed);

        let x = random(width);
        let y = random(height);
        backgroundStarArray[i].set(x, y);
    }
    isStart = true;
}

function finalize() {
    gameState = "End";
    noLoop();
}

function keyPressed() {

    if (keyInput === true && gameState === "Game") {
        if (keyCode === UP_ARROW) {
            player1.moveUp();
        } else if (keyCode === DOWN_ARROW) {
            player1.moveDown();
        } else if (keyCode === 90) {
            player1.shot();
        }
    }
    if (gameState === "End" && keyCode === 82) {
        location.reload();
    }
}

window.addEventListener("beforeunload", (e) => {
    e.returnValue = "ページを離れます．よろしいですか？"
});

class Fighter2 extends TextFighter2 {
    constructor() {
        super();
        this.appearance = "🐉";
        this.life = 200;
        this.speed = 25;
        this.power = 25;
        this.password = 'pass';
    }
}

