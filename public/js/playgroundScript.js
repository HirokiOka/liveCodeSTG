const gameInterval = 10000;
let isRunning = false;
let timer = 10;
let startTime = 0;

let editor = ace.edit("player-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.setValue(`//Player \nfunction playerLoop() {\n\n}`);

let playerAction = null;

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 13 && e.ctrlKey) {
        runCode();
    }
});


let runButton = new Vue({
    el: "#run-button",
    methods: {
        onClick: function() {
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
        }, (100 - player.speed) * 10);
    } catch (e) {
        console.log(e);
    }

    setTimeout(() => {
        clearInterval(playerAction);
        isRunning = false;
        timer = 10;
    }, gameInterval);
    
}