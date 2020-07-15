// const socket = io();
const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let commandInput = ace.edit("command_input");
let commandOutput = ace.edit("command_output");
let player1Action = null;
let player2Action = null;
let player1State = false;
let player2State = false;
let editor1 = document.getElementById("editor1");
let editor2 = document.getElementById("editor2");
let editors = document.getElementById("editors");
let player1ReadyButton = document.getElementById("player1ReadyButton");
let player2ReadyButton = document.getElementById("player2ReadyButton");;

let enemyCode = `//Player2
player2.randomMove();
player2.shot();`;
let isCommandPressed =false;
let isReturnPressed = false;

let ss = sessionStorage;

aceEditor1.setValue("//Player1\n");
aceEditor1.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript"
});
aceEditor1.$blockScrolling = Infinity;

aceEditor2.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript"
});
aceEditor2.setValue("//Player2\n");
aceEditor2.$blockScrolling = Infinity;

commandInput.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    showLineNumbers: false,
    showGutter: false
});
commandInput.$blockScrolling = Infinity;

commandOutput.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    showLineNumbers: false,
    showGutter: false,
    readOnly: true
});
commandOutput.$blockScrolling = Infinity;


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

        if (aceEditor2.isFocused()) {
            player2Ready();
        }

        if (editor.isFocused()) {
            createCharacter();
        }
    }

    if (e.keyCode === 13 && commandInput.isFocused()) {
        eval(commandInput.getValue());
        commandInput.setValue("");
    }
    
});


//記述したコードをサーバへ送信
function player1Ready() {
    if (gameState === "End") { return; }
    if (keyInput !== true) {
        let player1Code = aceEditor1.getValue();
        socket.emit('player1', {
            'player1Code': player1Code,
            'roomId': ss.roomId
        });
    }
}

function player2Ready() {
    if (gameState === "End") { return; }
    if (keyInput !== true) {
        let player2Code = aceEditor2.getValue();
        socket.emit('player2', {
            'player2Code': player2Code,
            'roomId': ss.roomId
        });
    }
}

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
        isRunning = true;
        startTime = Date.now();
        gameState = "Game";
        editors.style.opacity = 0.4;
        aceEditor1.setValue(player1.code);
        aceEditor2.setValue(player2.code);
        
        try {
            player1Action = setInterval(() => {
                eval(player1.code);
            }, (100 - player1.speed) * 10);
    
            player2Action = setInterval(() => {
                eval(player2.code);
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
                editors.style.opacity = 0.6;
                aceEditor1.setReadOnly(false);
                aceEditor2.setReadOnly(false);
                player1ReadyButton.disabled = false;
                player2ReadyButton.disabled = false;
            }
        }, gameInterval);

    }
}


