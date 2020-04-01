const express = require('express');
const app = express();
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
let clientNum = 0;

app.set('ejs', ejs.renderFile);
app.use(express.static('public'));

app.get('/', (req, res) => {
    clientNum++;
    if (clientNum > 2) {
        res.send('Please Wait...');
    } else {
        res.render('index.ejs', {
            clientId: clientNum
        });
    }
    console.log(`client${clientNum} connected`);
});

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

    socket.on('gameEnd', (state) => {
        console.log('Game');
        clientNum = 0;
    });

});


http.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});