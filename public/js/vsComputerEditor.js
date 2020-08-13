const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let commandInput = ace.edit("command_input");
let commandOutput = ace.edit("command_output");
let player1Action = null;
let player2Action = null;
let player1State = false;
let editor1 = document.getElementById("editor1");
let editor2 = document.getElementById("editor2");
let editors = document.getElementById("editors");
let player1ReadyButton = document.getElementById("player1ReadyButton");

let computerCodes = [
    `//Computer

function player2Loop() {
    player2.randomMove();
    player2.shot();
}`,
    `//Computer

function player2Loop() {
    player2.shot();
}`,
    `//Computer

function player2Loop() {
    player2.upDownAttack();
}`
];

let isCommandPressed =false;
let isReturnPressed = false;

aceEditor1.setValue(`//Player

function player1Loop() {

}
`);
aceEditor1.$blockScrolling = Infinity;
aceEditor1.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript"
});
aceEditor1.resize();

aceEditor1.renderer.setOption({"maxLines": 15});

aceEditor2.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    readOnly: true
});
aceEditor2.setValue(`//Computer

function player2Loop() {

}`);
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

        if (editor.isFocused()) {
            createCharacter();
        }

    }

    if (e.keyCode === 13 && commandInput.isFocused()) {
        eval(commandInput.getValue());
        commandInput.setValue("");
    }
    
});

function player1Ready() {
    if (gameState === "End") { return; }
    // if (keyInput !== true) {
        let player1Code = aceEditor1.getValue();
        player1.setCode(player1Code);
        player1ReadyButton.disabled = true;
        player1State = true;
        gameStart();
    // }
}

function gameStart() {
    if (gameState === "End") { return; }

    if (player1State === true) {
        isRunning = true;
        startTime = Date.now();
        gameState = "Game";
        editors.style.opacity = 0.4;
        aceEditor1.setValue(player1.code);
        aceEditor2.setValue(player2.code);
        
        try {
            eval(player1.code);
            player1Action = setInterval(() => {
                player1Loop();
            }, (100 - player1.speed) * 10);
            
            eval(player2.code);
            player2Action = setInterval(() => {
                player2Loop();
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
                editors.style.opacity = 0.6;
                aceEditor1.setReadOnly(false);
                aceEditor2.setReadOnly(false);
                player2.setCode(computerCodes[Math.floor(Math.random() * computerCodes.length)]);
                player1ReadyButton.disabled = false;
            }
        }, gameInterval);

    }
}


