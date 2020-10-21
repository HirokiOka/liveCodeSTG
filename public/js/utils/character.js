class Character {
    constructor(x, y, w, h, life, imagePath) {
        this.position = createVector(x, y);
        this.vector = createVector(0.0, -1.0);
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
    constructor(x, y, w, h, clock, power, imagePath) {
        super(x, y, w, h, 0, imagePath);
        this.clock = clock;
        this.power = power;
        this.direction = 'top';
        this.shotCheckCounter = 0;
        this.shotInterval = 10;
        this.shotArray = null;
        this.life = 100;
        this.password = 'password';
        this.code = null;
    }

    setTarget(target) {
        this.target = target;
    }

    setShotArray(shotArray) {
        this.shotArray = shotArray;
    }

    setCode(code) {
        this.code = code;
    }

    moveTo(target) {
        if (target === 'top') {
            this.position.y = 48;
        }else if (target === 'center') {
            this.position.y = 240;
        } else if (target === 'bottom') {
            this.position.y = 432;
        }
    }

    moveUp () {
        this.position.y -= this.clock;
        this.direction = 'top';
    }

    moveDown () {
        this.position.y += this.clock;
        this.direction = 'bottom';
    }

    randomMove() {
        randomSeed(floor(Date.now()) * this.id);
        let r = random();
        if (r < 1/2) {
            this.moveUp();
        } else {
            this.moveDown();
        }
    }

    enemySearch() {
        if (this.position.y === this.target.position.y) {
            return true;
        } else {
            return false;
        }
    }

    isDanger() {
        this.target.shotArray.forEach((e) => {
            if (e.position.y === this.position.y) {
                return true;
            }
        });
        return false;
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
    //攻撃テンプレートメソッド
    randomAttack() {
        this.randomMove();
        this.shot();
    }

    upDownAttack() {
        if (this.direction === 'top') {
            this.moveUp();
        } else if (this.direction === 'bottom') {
            this.moveDown();
        }
        
        if (this.position.y <= 48) {
            this.direction = 'bottom';
        } else if (this.position.y >= 432) {
            this.direction = 'top';
        }
        this.shot();
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

//x, y, w, h, clock, power, imagePath
class BaseFighter2 extends Player {
    constructor() {
        super(width - 40, height / 2, 64, 64, 25, 20, '/img/player2.png');
    }
}

class TextFighter1 extends Player {
    constructor() {
        super(40, height / 2, 64, 64, 20, 20, '/img/player1.png');
        this.size = 64;
        this.id = 1;
    }

    draw() {
        textSize(this.size);
        textAlign(CENTER, CENTER)
        text(this.appearance, this.position.x, this.position.y);
        textAlign(LEFT, BOTTOM);
    }
}

class TextFighter2 extends Player {
    constructor() {
        super(width - 40, height / 2, 64, 64, 25, 20, '/img/player2.png', player1);
        this.size = 64;
        this.id = 2;
    }

    draw() {
        textSize(this.size);
        textAlign(CENTER, CENTER)
        text(this.appearance, this.position.x, this.position.y);
        textAlign(LEFT, BOTTOM);
    }
}

class Fighter extends BaseFighter1 {
    constructor() {
        super();
        this.life = 100;
        this.clock = 25;
        this.power = 25;
        this.confidentiality = 25;
        this.password = 'pass';
    }
}

class Fighter2 extends TextFighter2 {
    constructor() {
        super();
        this.appearance = "🐉";
        this.life = 200;
        this.clock = 25;
        this.power = 25;
        this.password = 'pass';
    }
}


class Shot extends Character {
    constructor(x, y, w, h, imagePath) {
        super(x, y, w, h, 0, imagePath);
        this.clock = 7;
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
        this.position.x += this.vector.x * this.clock;
        this.position.y += this.vector.y * this.clock;

        let dist = this.position.dist(this.target.position);
        
        if (this.target.life > 0 && dist <= (this.width + this.target.width) / 4) {
            
            this.target.life -= this.power;
            
            if (this.target.life < 0) {
                this.target.life = 0;
            }
            this.life = 0;
            // playCollisionSound();
        }
        this.draw();
    }

    isCaptured() {
        if (this.position.y === this.target.position) {
            return true;
        }
    }


}

class BackgroundStar {
    constructor(size, clock, color="#ffffff") {
        this.size = size;
        this.clock = clock;
        this.color = color;
        this.position = null;
    }

    set(x, y) {
        this.position = createVector(x, y);
    }

    update() {
        fill(this.color);
        this.position.x += this.clock;
        square(this.position.x - this.size / 2, this.position.y - this.size / 2, this.size);

        if (this.position.x + this.size > width) {
            this.position.x = -this.size;
        }
        
    }
}

