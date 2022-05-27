const gameInterval = 10000;
let gameState;
const socket = io();

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
let player1Terminal = ace.edit("player1-terminal");
let player2Terminal = ace.edit("player2-terminal");
let player1Action = null;
let player2Action = null;
let player1State = false;
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


const editor = ace.edit("character-editor");
const player1Color = "#121259";
const player2Color = "#ad1500";
let defaultCode = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛸";
        this.life = 40;
        this.clock = 30;
        this.power = 30;
    }
}
player1 = new Fighter();
`;
let attack = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🚀";
        this.life = 20;
        this.clock = 30;
        this.power = 50;
    }
}
player1 = new Fighter();
`;
let speed = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛩";
        this.life = 20;
        this.clock = 60;
        this.power = 20;
    }
}
player1 = new Fighter();
`;
let tank = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛳";
        this.life = 60;
        this.clock = 10;
        this.power = 30;
    }
}
player1 = new Fighter();
`;

aceEditor1.setValue(`//Player

function player1Loop() {

}
`);
aceEditor1.$blockScrolling = Infinity;
aceEditor1.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    wrap: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});
aceEditor1.resize();

aceEditor1.renderer.setOption({"maxLines": 15});

aceEditor2.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    readOnly: true,
    wrap: true,
});
aceEditor2.setValue(`//Computer

function player2Loop() {

}`);
aceEditor2.$blockScrolling = Infinity;


player1Terminal.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/SH",
    showLineNumbers: false,
    showGutter: false,
    readOnly: true,
    wrap: true
});
player1Terminal.setValue("player1:");
player1Terminal.$blockScrolling = Infinity;

player2Terminal.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/SH",
    showLineNumbers: false,
    showGutter: false,
    readOnly: true,
    wrap: true
});
player2Terminal.setValue("player2:");
player2Terminal.$blockScrolling = Infinity;
