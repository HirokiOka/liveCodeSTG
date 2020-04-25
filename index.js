const express = require('express');
const app = express();
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
let client1 = false;
let client2 = false;

app.set('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('top');
});

app.get('/vs-player', (req, res) => {
    if (client1 === false) {

        res.render('vsPlayer', { clientId: 1 });
        client1 = true;
        console.log("client connected and client1 assgined");

    } else if (client2 === false) {

        res.render('vsPlayer', { clientId: 2 });
        client2 = true;
        console.log("client connected and client2 assgined");

    } else {
        res.send("Please wait...");
    }
});

app.get('/vs-computer', (req, res) => {
    res.render('vsComputer');
});

app.get('/playground', (req, res) => {
    res.render('playground');
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

    socket.on('client disconnected', (id) => {
        if (id.clientId == 1) {
            client1 = false;
        } else if (id.clientId == 2) {
            client2 = false;
        }
        console.log(`client ${id.clientId} disconnected`);
    });

});


http.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});