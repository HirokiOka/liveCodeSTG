const editor = ace.edit("character-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;

const player1Color = "#121259";
const player2Color = "#ad1500";

let defaultCode = `class Fighter extends TextFighter1 {
    constructor() {
        super();
        this.appearance = "🛸";
        this.life = 200;
        this.speed = 25;
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
        this.speed = 25;
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
        this.speed = 50;
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
        this.speed = 15;
        this.power = 40;
        this.password = 'pass';
    }
}
player1 = new Fighter();
`;

let radio = document.getElementById('target');

radio.addEventListener('click', () => {
    let type = radio.type.value;
    if (type === "attack") {
        editor.setValue(attack)
    } else if (type === "speed") {
        editor.setValue(speed);
    } else if (type === "tank") {
        editor.setValue(tank);
    } else if (type === "custom") {
        editor.setValue(defaultCode);
    }
}, false);

editor.setValue(defaultCode);
