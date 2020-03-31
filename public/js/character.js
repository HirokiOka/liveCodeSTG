class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        if (x != null) { this.x = x; }
        if (y != null) { this.y = y; }
    }

    distance(target) {
        let x = this.x - target.x;
        let y = this.y - target.y;
        return sqrt(x * x + y * y);
    }
}

class Character {
    constructor(x, y, w, h, life, imagePath) {
        this.position = new Position(x, y);
        this.vector = new Position(0.0, -1.0);
        this.width = w;
        this.height = h;
        this.life = life;
        this.ready = false;
        this.image = loadImage(imagePath);
    }

    setVector(x, y) {
        this.vector.set(x, y);
    }

    setVectorFromAngle(angle) {
        this.angle = angle;
        let s = sin(angle - HALF_PI);
        let c = cos(angle- HALF_PI);
        this.vector.set(c, s);
    }

    draw() {
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        push();
        translate(this.position.x, this.position.y);
        rotate(this.angle);
        image(this.image, - offsetX, - offsetY,this.width, this.height);
        pop();   
    }
}

class Player extends Character {
    constructor(x, y, w, h, speed, power, imagePath) {
        super(x, y, w, h, 0, imagePath);
        this.speed = speed;
        this.power = power;
        this.shotCheckCounter = 0;
        this.shotInterval = 10;
        this.shotArray = null;
        this.life = 100;
        this.password = 'password';
        this.code = null;
    }

    setShotArray(shotArray) {
        this.shotArray = shotArray;
    }

    setChargeShot(chargeShot) {
        this.chargeShot = chargeShot;
    }

    setCode(code) {
        this.code = code;
    }

    moveTo(y) {
        this.position.y = y;
    }

    moveUp () {
        this.position.y -= this.speed;
    }

    moveDown () {
        this.position.y += this.speed;
    }

    randomMove() {
        randomSeed(floor(Date.now()));
        let r = random();
        if (r < 1/2) {
            this.moveUp();
        } else {
            this.moveDown();
        }
    }

    shot() {
        if (this.shotCheckCounter >= 0) {
            for (let i = 0; i < this.shotArray.length; i++) {
                if (this.shotArray[i].life <= 0) {
                    this.shotArray[i].set(this.position.x, this.position.y);
                    this.shotArray[i].setVectorFromAngle(this.angle);
                    this.shotCheckCounter = -this.shotInterval;
                    break;
                }
            }
        }
    }   

    update() {
        if (this.life <= 0) { return; }
        let tx = constrain(this.position.x, 0, width);
        let ty = constrain(this.position.y, barHeight, height - barHeight);
        this.position.set(tx, ty);
        this.draw();
        this.shotCheckCounter++;
    }
}

class BaseFighter1 extends Player {
    constructor() {
        super(40, height / 2, 64, 64, 20, 20, '/img/player1.png');
    }
}

class BaseFighter2 extends Player {
    constructor() {
        super(width - 40, height / 2, 64, 64, 25, 20, '/img/player2.png');
    }
}

class Shot extends Character {
    constructor(x, y, w, h, imagePath) {
        super(x, y, w, h, 0, imagePath);
        this.speed = 7;
        this.power = 20;
        this.target = null;
    }
    set(x, y) {
        this.position.set(x, y);
        this.life = 1;
    }

    setPower(power) {
        this.power = power;
    }

    setTarget(target) {
        if (target != null) {
            this.target = target;
        }
    }

    update() {
        if (this.life <= 0) { return; }
        if (this.position.x + this.width < 0 || this.position.x + this.width > width) {
            this.life = 0;
        }
        this.position.x += this.vector.x * this.speed;
        this.position.y += this.vector.y * this.speed;

        let dist = this.position.distance(this.target.position);
        
        if (this.target.life > 0 && dist <= (this.width + this.target.width) / 4) {
            
            this.target.life -= this.power;
            
            if (this.target.life < 0) {
                this.target.life = 0;
            }
            this.life = 0;
            playCollisionSound();
        }
        this.draw();
    }
}

class BackgroundStar {
    constructor(size, speed, color="#ffffff") {
        this.size = size;
        this.speed = speed;
        this.color = color;
        this.position = null;
    }

    set(x, y) {
        this.position = new Position(x, y);
    }

    update() {
        fill(this.color);
        this.position.x += this.speed;
        square(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size);

        if (this.position.x + this.size > width) {
            this.position.x = -this.size;
        }
        
    }
}

