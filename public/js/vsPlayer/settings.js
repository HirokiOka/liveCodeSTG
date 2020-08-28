const socket = io();
const editor = ace.edit("character-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;

let playerNum = document.getElementById('player-num').textContent;
const player1Color = "#121259";
const player2Color = "#70261A";

let defaultCode = `class Fighter${playerNum} extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🛸";
        this.life = 200;
        this.clock = 25;
        this.power = 25;
        this.password = 'pass';
    }
}
player${playerNum} = new Fighter${playerNum}();
`;

if  (playerNum == 1) {
    document.body.style.backgroundColor = player1Color;
} else if (playerNum == 2) {
    document.body.style.backgroundColor = player2Color;
}

let attack = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🚀";
        this.life = 150;
        this.clock = 25;
        this.power = 70;
        this.password = 'pass';
    }
}
player${playerNum} = new Fighter();
`;

let speed = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🛩";
        this.life = 150;
        this.clock = 50;
        this.power = 25;
        this.password = 'pass';
    }
}
player${playerNum} = new Fighter();
`;

let tank = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🛳";
        this.life = 200;
        this.clock = 15;
        this.power = 40;
        this.password = 'pass';
    }
}
player${playerNum} = new Fighter();
`;


editor.setValue(defaultCode);

const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let commandInput = ace.edit("command_input");
let commandOutput = ace.edit("command_output");
let player1State = false;
let player2State = false;
let editor1 = document.getElementById("editor1");
let editor2 = document.getElementById("editor2");
let editors = document.getElementById("editors");


let enemyCode = `//Player2
player2.randomMove();
player2.shot();`;
let isCommandPressed =false;
let isReturnPressed = false;

let ss = sessionStorage;

aceEditor1.setValue(`//Player1

function player1Loop() {

}`);
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
aceEditor2.setValue(`//Player2

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




