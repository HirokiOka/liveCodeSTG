const socket = io();
let gameState;
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
        this.life = 40;
        this.clock = 30;
        this.power = 30;
    }
}
player${playerNum} = new Fighter${playerNum}();
`;

let attack = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🚀";
        this.life = 20;
        this.clock = 30;
        this.power = 50;
    }
}
player${playerNum} = new Fighter();
`;

let speed = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🛩";
        this.life = 20;
        this.clock = 60;
        this.power = 20;
    }
}
player${playerNum} = new Fighter();
`;

let tank = `class Fighter extends TextFighter${playerNum} {
    constructor() {
        super();
        this.appearance = "🛳";
        this.life = 60;
        this.clock = 10;
        this.power = 30;
    }
}
player${playerNum} = new Fighter();
`;


if  (playerNum == 1) {
    document.body.style.backgroundColor = player1Color;
} else if (playerNum == 2) {
    document.body.style.backgroundColor = player2Color;
}

editor.setValue(defaultCode);
sessionStorage.setItem('playerNum',playerNum);

const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let player1Terminal = ace.edit("player1-terminal");
let player2Terminal = ace.edit("player2-terminal");
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
    mode: "ace/mode/javascript",
    wrap: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
aceEditor1.$blockScrolling = Infinity;

aceEditor2.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    wrap: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
aceEditor2.setValue(`//Player2

function player2Loop() {

}`);
aceEditor2.$blockScrolling = Infinity;


player1Terminal.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    showLineNumbers: false,
    showGutter: false,
    readOnly: true
});
player1Terminal.setValue("player1:");
player1Terminal.$blockScrolling = Infinity;

player2Terminal.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    showLineNumbers: false,
    showGutter: false,
    readOnly: true
});
player2Terminal.setValue("player2:");
player2Terminal.$blockScrolling = Infinity;



