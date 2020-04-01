
const editor = ace.edit("character-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;

let clientId = document.getElementById('player-id').textContent;

let defaultCode = `
class Fighter${clientId} extends BaseFighter${clientId} {
    constructor() {
        super();
        this.life = 100;
        this.speed = 25;
        this.power = 25;
        this.confidentiality = 25;
        this.password = 'pass';
    }
}
player${clientId} = new Fighter${clientId}();
`;
editor.setValue(defaultCode);


