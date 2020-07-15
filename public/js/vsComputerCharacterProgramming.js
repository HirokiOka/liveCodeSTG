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
        this.appearance = "🚀";
        this.life = 200;
        this.speed = 25;
        this.power = 25;
        this.password = 'pass';
    }
}
player1 = new Fighter();
`;
editor.setValue(defaultCode);
