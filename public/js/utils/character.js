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

    // get position() {
    //     return this._position;
    // }

    // set position(value) {
    //     if (isStart) {
    //         throw Error("Parameters cannot be changed");
    //     }
    //     this._position = value;
    // }

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
        this._x = this.position.x;
        this._y = this.position.y;
        this._clock = clock;
        this._power = power;
        this.direction = 'top';
        this.shotCheckCounter = 0;
        this.shotInterval = 10;
        this.shotArray = null;
        this._life = 100;
        this.password = 'password';
        this.code = null;
    }

    //getter
    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }

    get life() {
        return this._life;
    }

    get clock() {
        return this._clock;
    }

    get power() {
        return this._power;
    }

    //setter
    set x(value) {
        if (isStart) {
            throw Error("Parameters cannot be changed");
        }
        this._x = value;
    }

    set y(value) {
        if (isStart) {
            throw Error("Parameters cannot be changed");
        }
        this._y = value;
    }

    set life(value) {
        if (isStart) {
            throw Error("Parameters cannot be changed");
        }
        this._life = value;
    }

    set clock(value) {
        if (isStart) {
            throw Error("Parameters cannot be changed");
        }
        this._clock = value;
    }

    set power(value) {
        if (isStart) {
            throw Error("Parameters cannot be changed");
        }
        this._power = value;
    }

    //
    reduceLife(power) {
        this._life -= power;
    }

    //methods
    setTarget(target) {
        this.target = target;
    }

    setShotArray(shotArray) {
        this.shotArray = shotArray;
    }

    setCode(code) {
        this.code = code;
    }

    moveUp () {
        this._y -= 25;
        this.direction = 'top';
    }

    moveDown () {
        this._y += 25;
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
        if (this._y === this.target._y) {
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
                    this.shotArray[i].set(this._x, this._y);
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
        
        if (this._y <= 48) {
            this.direction = 'bottom';
        } else if (this._y >= 432) {
            this.direction = 'top';
        }
        this.shot();
    }

    draw() {
        let offsetX = this.width / 2;
        let offsetY = this.height / 2;
        push();
        translate(this._x, this._y);
        rotate(this.angle);
        image(this.image, - offsetX, - offsetY,this.width, this.height);
        pop();   
    }

    update() {
        if (this.life <= 0) { return; }
        let tx = constrain(this._x, 0, width);
        let ty = constrain(this._y, barHeight, height - barHeight);
        // this.position.set(tx, ty);
        this._x = tx;
        this._y = ty;
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
        text(this.appearance, this._x, this._y);
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
        text(this.appearance, this._x, this._y);
        textAlign(LEFT, BOTTOM);
    }
}

class Fighter extends BaseFighter1 {
    constructor() {
        super();
        this._life = 100;
        this._clock = 25;
        this._power = 25;
        this.confidentiality = 25;
        this.password = 'pass';
    }
}

class Fighter2 extends TextFighter2 {
    constructor() {
        super();
        this.appearance = "🐉";
        this.life = 50 * 5;
        this.clock = 25;
        this.power = 25;
        // this.password = 'pass';
    }
}


class Shot extends Character {
    constructor(x, y, w, h, imagePath) {
        super(x, y, w, h, 0, imagePath);
        this.clock = 7;
        this.power = 20;
        this.target = null;
        this.sound = null;
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

    setSound(sound) {
        this.sound = sound;
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
            
            // this.target.life -= this.power;
            this.target.reduceLife(this.power);
            
            if (this.target.life < 0) {
                this.target.life = 0;
            }
            this.life = 0;
            if (this.sound !== null) {
                this.sound.play();
            }
            
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

