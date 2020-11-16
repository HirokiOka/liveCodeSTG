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

let startButton = new Vue({
    el: "#start",
    data: {
        isDisabled: false
    },
    methods: {
        onClick() {
            eval(editor.getValue());
            let player;
            if (playerNum == 1) {
                player = player1;
            } else if (playerNum == 2){
                player = player2;
            }
            if (hardModeButton.isHard) {
                let paramSum = player.life + player.clock + player.power;
                if (paramSum > 100) {
                    alert("パラメータの合計が大きすぎます");
                    delete player;
                    return; 
                }
            }
            this.isDisabled = true;
            socket.emit('create', {
                'code': editor.getValue(),
                'roomId': ss.roomId
            });
        }
    }
});

window.addEventListener("keydown", e => {
    if (gameState === "Game") {
        e.preventDefault();
        return;
    }

    if (e.keyCode === 13 && e.ctrlKey) {
        if (aceEditor1.isFocused() && ss.playerNum == 1) {
            player1Ready();
        }
        if (aceEditor2.isFocused() && ss.playerNum == 2) {
            player2Ready();
        }
        if (editor.isFocused()) {
            createCharacter();
        }
    }

});

let player1ReadyButton = new Vue({
    el: "#player1-ready",
    data: {
        isVisible() {
            return ss.playerNum == '1';
        }
    },
    methods: {
        onClick() {
            player1Ready();
        }
    }
});

let player2ReadyButton = new Vue({
    el: "#player2-ready",
    data: {
        isVisible() {
            return ss.playerNum == '2';
        }
    },
    methods: {
        onClick() {
            player2Ready();
        }
    }
});

function player1Ready() {
    if (gameState === "End") { return; }
    socket.emit('player1', {
        'player1Code': aceEditor1.getValue(),
        'roomId': ss.roomId
    });
}

function player2Ready() {
    if (gameState === "End") { return; }
    socket.emit('player2', {
        'player2Code': aceEditor2.getValue(),
        'roomId': ss.roomId
    });
}

let resetButton = new Vue({
    el: "#reset",
    methods: {
        onClick() {
            if (ss.playerNum == '1') {
                aceEditor1.setValue('//Player1\n\nfunction player1Loop() {\n\n}');
            } else if (ss.playerNum == '2') {
                aceEditor2.setValue('//Player2\n\nfunction player2Loop() {\n\n}');
            }
        }
    }
});

//サーバから送られてきたコードをエディタにセット
socket.on('player1', msg => {
    player1.setCode(msg.player1Code);
    player1ReadyButton.disabled = true;
    player1State = true;
    gameStart();
});

socket.on('player2', msg => {
    player2.setCode(msg.player2Code);
    player2ReadyButton.disabled = true;
    player2State = true;
    gameStart();
});

//エディタにセットされているコードをループしてevalする
function gameStart() {
    if (!player1State && !player2State) { return; }
    if (gameState === "End") { return; }
    if (player1State === true && player2State === true) {
        let player1Action = null;
        let player2Action = null;
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
                player2State = false;
                editors.style.opacity = 0.6;
                aceEditor1.setReadOnly(false);
                aceEditor2.setReadOnly(false);
                player1ReadyButton.disabled = false;
                player2ReadyButton.disabled = false;
            }
        }, gameInterval);
    }
}

window.addEventListener("beforeunload", (e) => {
    e.returnValue = "ページを離れます．よろしいですか？"
});

socket.on('create', msg => {
    eval(msg.code); 
    console.log('created!');
    if (player1 && player2) {
        player1.life *= 5;
        player2.life *= 5;
        initialize();
    }
});


function initialize() {

    document.getElementById('character-programming').style.display = 'none';
    document.getElementById('game').style.visibility = 'visible';

    player1.setVectorFromAngle(HALF_PI);
    player2.setVectorFromAngle(-HALF_PI);

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

socket.on('disconnected', msg => {
    alert('player disconnected');
});
window.onbeforeunload = () => {
    socket.emit('playerDisconnected', { 
        'roomId': ss.roomId
    });
};