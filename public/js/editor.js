const socket = io();
const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let player1FinalCode = null;
let player2FinalCode = null;
let player1Action = null;
let player2Action = null;
let player1State = false;
let player2State = false;
let editors = document.getElementById("editors");
let player1ReadyButton = document.getElementById("player1ReadyButton");
let player2ReadyButton = document.getElementById("player2ReadyButton");;

let enemyCode = `//Player2
player2.randomMove();
player2.shot();`;
let isCommandPressed =false;
let isReturnPressed = false;

aceEditor1.setFontSize(18);
aceEditor1.setTheme("ace/theme/chaos");
aceEditor1.getSession().setMode("ace/mode/javascript");
aceEditor1.setValue("//Player1\n");
aceEditor2.setFontSize(18);
aceEditor2.setTheme("ace/theme/chaos");
aceEditor2.getSession().setMode("ace/mode/javascript");
aceEditor2.setValue("//Player2\n");

/*
window.addEventListener("keydown", (e)=> {
    if (e.keyCode === 91) {
        isCommandPressed = true;
    }

    if (e.keyCode === 13) {
        isReturnPressed = true;
    }

    if (isCommandPressed === true && isReturnPressed === true) {
        if (gameState === "Programming") {
            run();
        }
    }
});

window.addEventListener("keyup", (e) => {
    if (e.keyCode === 91) {
        isCommandPressed = false;
    }
    if (e.keyCode === 13) {
        isReturnPressed = false;
    }
});
*/


function player1Ready() {
    if (gameState === "End") { return; }

    if (keyInput !== true) {
        let player1Code = aceEditor1.getValue();
        socket.emit('player1', {
            "player1Code": player1Code
        });
    }
}

function player2Ready() {
    if (gameState === "End") { return; }
    
    if (keyInput !== true) {
        let player2Code = aceEditor2.getValue();
        socket.emit('player2', {
            "player2Code": player2Code
        });
    }
}

socket.on('player1', (code) => {
    player1FinalCode = code.player1Code;
    player1ReadyButton.disabled = true;
    player1State = true;
    if (player2State === true) {
        gameStart();
    }
});

socket.on('player2', (code) => {
    player2FinalCode = code.player2Code;
    player2ReadyButton.disabled = true;
    player2State = true;
    if (player1State === true) {
        gameStart();
    }
});

function gameStart() {
    if (gameState === "End") { return; }

    if (player1State === true && player2State === true) {
        isRunning = true;
        startTime = Date.now();
        gameState = "Game";
        editors.style.opacity = 0.4;
        aceEditor1.setValue(player1FinalCode);
        aceEditor2.setValue(player2FinalCode);
        

        try {
            player1Action = setInterval(() => {
                eval(player1FinalCode);
            }, (100 - player1.speed) * 10);
    
            player2Action = setInterval(() => {
                eval(player2FinalCode);
            }, (100 - player2.speed) * 10);
        } catch(e) {
            console.log(e);
        }

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
                editors.style.opacity = 0.8;
                aceEditor1.setReadOnly(false);
                aceEditor2.setReadOnly(false);
                player1ReadyButton.disabled = false;
                player2ReadyButton.disabled = false;
            }
        }, gameInterval);

    }
}

