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
            this.isDisabled = true;
            eval(editor.getValue());
            player2 = new Fighter2();
            // characterProgramming.show = false;
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
        
        eval(player1.code);
        eval(player2.code);
        player1Action = setInterval(() => {
            try {
                player1Loop();
            } catch (e1) {
                player1Terminal.setValue("player1:" + e1.toString());
            }
        }, (100 - player1.clock) * 10);

        player2Action = setInterval(() => {
            try {
                player2Loop();
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
    if (gameState !== "Programming") { return; }
    if (e.keyCode === 13 && e.ctrlKey) {
        if (aceEditor1.isFocused()) {
            player1Ready();
        }

        if (editor.isFocused()) {
            createCharacter();
        }
    }
    
});