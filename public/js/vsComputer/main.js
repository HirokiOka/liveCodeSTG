characterProgrammingInitialize();

let exSound = new Sound();
exSound.load('./sound/explosion.mp3', (error) => {
    if (error != null) {
        alert('ファイルの読み込みエラーです．');
        return;
    }
});

let radioButton = new Vue({
    el: "#character-type",
    data: {
        type: 'custom'
    },
    watch: {
        type() {
            switch (this.type) {
                case 'attack':
                    editor.setValue(attack);
                    break;
                case 'speed':
                    editor.setValue(speed);
                    break;
                case 'tank':
                    editor.setValue(tank);
                    break;
                case 'custom':
                    editor.setValue(defaultCode);
                    break;
            }
        }
    }
});

let hardModeButton = new Vue({
    el: "#hard-mode",
    data: {
        isHard: false
    },
    watch: {
        isHard() {
            if (!this.isHard) {
                this.isHard = false;
            } else {
                this.isHard = true;
            }
        }
    }
});

function characterProgrammingInitialize() {
    editor.setFontSize(18);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.$blockScrolling = Infinity;
    editor.setValue(defaultCode);
}

let startButton = new Vue({
    el: "#start",
    data: {
        isDisabled: false
    },
    methods: {
        onClick() {
            eval(editor.getValue());
            if (hardModeButton.isHard) {
                let paramSum = player1.life + player1.clock + player1.power;
                if (paramSum > 100) {
                    alert("パラメータの合計が大きすぎます");
                    delete player1;
                    return; 
                }
            }
            player1.life *= 5;
            this.isDisabled = true;
            player2 = new Fighter2();
            initialize();
        }
    }
});

function initialize() {

    document.getElementById('character-programming').style.display = 'none';
    document.getElementById('game').style.visibility = 'visible';

    player1.setVectorFromAngle(HALF_PI);
    player2.setVectorFromAngle(-HALF_PI);
    //computerのコードを開始時にセット
    player2.setCode(computerCodes[Math.floor(Math.random() * computerCodes.length)]);
    //targetをセット
    player1.setTarget(player2);
    player2.setTarget(player1);

    for (let i = 0; i < SHOT_MAX_COUNT; i++) {
        player1ShotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        player1ShotArray[i].setTarget(player2);
        player1ShotArray[i].setPower(player1.power);
        player1ShotArray[i].setSound(exSound);
        player2ShotArray[i] = new Shot(0, 0, 32, 32, shotImage);
        player2ShotArray[i].setTarget(player1);
        player2ShotArray[i].setPower(player2.power);
        player2ShotArray[i].setSound(exSound);
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


let player1ReadyButton = new Vue({
    el: "#player1-ready",
    data: {
        isDisabled: false
    },
    methods: {
        onClick() {
            player1Ready();
        }
    }
})

function player1Ready() {
    if (gameState === "End") { return; }
    player1.setCode(aceEditor1.getValue());
    this.isDisabled = true;
    player1State = true;
    //ここにsocket.ioでindex.jsにコード送る処理
    socket.emit('vscomputer', {
        code: aceEditor1.getValue()
    });
    gameStart();
}

let resetButton = new Vue({
    el: "#reset",
    methods: {
        onClick() {
            aceEditor1.setValue(`//Player

function player1Loop() {
            
}`);
        }
    }
});

function gameStart() {
    if (gameState === "End") { return; }

    if (player1State === true) {
        isRunning = true;
        startTime = Date.now();
        gameState = "Game";
        editors.style.opacity = 0.4;
        aceEditor1.setValue(player1.code);
        aceEditor2.setValue(player2.code);

        player1Terminal.setValue('player1:');
        player2Terminal.setValue('player2:');
        
        eval(player1.code);
        eval(player2.code);
        player1Action = setInterval(() => {
            try {
                player1Loop();
                player1.isMoved = false;
            } catch (e1) {
                player1Terminal.setValue("player1:" + e1.toString());
            }
        }, (100 - player1.clock) * 10);

        player2Action = setInterval(() => {
            try {
                player2Loop();
                player2.isMoved = false;
            } catch (e2) {
                player2Terminal.setValue("player2:" + e2.toString());
            }
        }, (100 - player2.clock) * 10);


        setTimeout(() => {
            clearInterval(player1Action);
            clearInterval(player2Action);
            if (gameState !== "End") {
                isRunning = false;
                timer = 10;
                round++;
                gameState = "Programming";
                player1State = false;
                editors.style.opacity = 0.6;
                aceEditor1.setReadOnly(false);
                aceEditor2.setReadOnly(false);
                player2.setCode(computerCodes[Math.floor(Math.random() * computerCodes.length)]);
                player1ReadyButton.isDisabled = false;
            }
        }, gameInterval);
    }
}


window.addEventListener("keydown", (e)=> {
    
    if (gameState === "Game") {
        e.preventDefault();
        return;
    }
    if (e.keyCode === 13 && e.ctrlKey) {
        if (aceEditor1.isFocused()) {
            player1Ready();
        }

        if (editor.isFocused()) {
            createCharacter();
        }
    }

    if (gameState === "End" && e.keyCode === 82) {
        location.reload();
    }
    
});