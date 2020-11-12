const gameInterval = 10000;

let aceEditor1 = ace.edit("player1-editor");
let aceEditor2 = ace.edit("player2-editor");
// let commandInput = ace.edit("command_input");
// let commandOutput = ace.edit("command_output");
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
        this.life = 200;
        this.clock = 25;
        this.power = 25;
        this.password = 'pass';
    }
}
player1 = new Fighter();
`;
let attack = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🚀";
        this.life = 150;
        this.clock = 25;
        this.power = 70;
        this.password = 'pass';
    }
}
player1 = new Fighter();
`;
let speed = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛩";
        this.life = 150;
        this.clock = 50;
        this.power = 25;
        this.password = 'pass';
    }
}
player1 = new Fighter();
`;
let tank = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛳";
        this.life = 200;
        this.clock = 15;
        this.power = 40;
        this.password = 'pass';
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
    // enableBasicAutocompletion: true,
    // enableSnippets: true,
    // enableLiveAutocompletion: true
});
aceEditor2.setValue(`//Computer

function player2Loop() {

}`);
aceEditor2.$blockScrolling = Infinity;


// commandInput.setOptions({
//     fontSize: 18,
//     theme: "ace/theme/chaos",
//     mode: "ace/mode/javascript",
//     showLineNumbers: false,
//     showGutter: false
// });
// commandInput.$blockScrolling = Infinity;


// commandOutput.setOptions({
//     fontSize: 18,
//     theme: "ace/theme/chaos",
//     mode: "ace/mode/SH",
//     showLineNumbers: false,
//     showGutter: false,
//     readOnly: true
// });
// commandOutput.$blockScrolling = Infinity;

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






