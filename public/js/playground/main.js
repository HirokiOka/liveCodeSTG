const gameInterval = 10000;
let isRunning = false;
let timer = 10;
let startTime = 0;

let editor = ace.edit("player-editor");
editor.setOptions({
    fontSize: 18,
    theme: "ace/theme/chaos",
    mode: "ace/mode/javascript",
    wrap: true,
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

editor.setValue(`//Player \nfunction playerLoop() {\n\n}`);
editor.$blockScrolling = Infinity;

let playerAction = null;

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
        runCode();
    }
});

let runButton = new Vue({
    el: "#run-button",
    methods: {
        onClick() {
            runCode();
        }
    }
});

function runCode() {
    if (isRunning) { return; }
    try {
        startTime = Date.now();
        isRunning = true;
        eval(editor.getValue());
        playerAction = setInterval(() => {
            playerLoop();
        }, (100 - player.clock) * 10);
    } catch (e) {
        console.log(e);
    }

    setTimeout(() => {
        clearInterval(playerAction);
        isRunning = false;
        timer = 10;
    }, gameInterval);
    
}