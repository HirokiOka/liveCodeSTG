const socket = io();

function player1Select() {
    socket.emit('player1 selected', {
        
    });
    location.href = "/game";
}

function player2Select() {
    location.href = "/game";
}

function spectatorSelect() {
    location.href = "/game";
}
