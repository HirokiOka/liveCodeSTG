const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;

app.use(express.static('public'));

io.on('connection', (socket) => {

    socket.on('player1', (code) => {
        io.emit('player1', {
            "player1Code": code.player1Code,
        });
    });

    socket.on('player2', (code) => {
        io.emit('player2', {
            "player2Code": code.player2Code,
        });
    });

    socket.on('create', (code) => {
        io.emit('create', {
            code: code.code
        });
    });

});

http.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});