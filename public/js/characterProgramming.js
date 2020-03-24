
const editor = ace.edit("character-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");

let defaultCode = `
class Fighter extends BaseFighter {
    constructor() {
        super();
        this.life = 100;
        this.speed = 25;
        this.power = 25;
        this.confidentiality = 25;
        this.password = 'password';
    }
}
player1 = new Fighter();
`;
editor.setValue(defaultCode);


