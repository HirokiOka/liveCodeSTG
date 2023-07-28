const backgroundColor = "#121259";
const SHOT_MAX_COUNT = 10;
const shotImage = '/img/viper_shot.png';
const playerImage = '/img/player1.png';
let player = null;
let enemy = null;
let shotArray = [];
let barHeight;
let topEdge;
let bottomEdge;

function setup() {
    let canvas = createCanvas(840, 480);
    canvas.parent('canvas');
    topEdge = height / 10;
    bottomEdge = height - topEdge;
    player = new Fighter();
    enemy = new Fighter();
    player.setVectorFromAngle(HALF_PI);
    player.id = 1;
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        shotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        shotArray[i].setTarget(enemy);
    }
    player.setShotArray(shotArray);
    barHeight = height / 10;
    textSize(32);
    fill(255);
}

function draw() {
    background(backgroundColor);
    player.update();
    shotArray.map((v) => {
        v.update();
    });
    if (isRunning) {
        timer = 10 - Math.floor((Date.now() - startTime) / 1000);
    }
    text(timer, width/2 - 20, 30);
}
