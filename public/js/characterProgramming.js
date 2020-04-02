const socket = io();
const editor = ace.edit("character-editor");
editor.setFontSize(18);
editor.setTheme("ace/theme/monokai");
editor.getSession().setMode("ace/mode/javascript");
editor.$blockScrolling = Infinity;

let clientId = document.getElementById('client-id').textContent;
const player1Color = "#1900b3";
const player2Color = "#ad1500";

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

if  (clientId == 1) {
    document.body.style.backgroundColor = player1Color;
} else if (clientId == 2) {
    document.body.style.backgroundColor = player2Color;
}
editor.setValue(defaultCode);

window.onbeforeunload = () => {
    socket.emit('client disconnected', { clientId });
}