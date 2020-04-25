
const backgroundColor = "#121259";
const SHOT_MAX_COUNT = 10;
let player = null;
let enemy = null;
let shotArray = [];
let shotImage = '/img/viper_shot.png';
let playerImage = '/img/player1.png';
let barHeight;

function setup() {
    let canvas = createCanvas(840, 480);
    canvas.parent('canvas');
    player = new Fighter();
    enemy = new Fighter();
    player.setVectorFromAngle(HALF_PI);
    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        shotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        shotArray[i].setTarget(enemy);
    }
    player.setShotArray(shotArray);
    barHeight = height / 10;
}

function draw() {
    background(backgroundColor);
    player.update();
    shotArray.map((v) => {
        v.update();
    });
}

class Fighter extends BaseFighter1 {
    constructor() {
        super();
        this.life = 100;
        this.speed = 25;
        this.power = 25;
        this.confidentiality = 25;
        this.password = 'pass';
    }
}
