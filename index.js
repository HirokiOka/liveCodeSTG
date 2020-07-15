const express = require('express');
const app = express();
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = process.env.PORT || 3000;
// let client1 = false;
// let client2 = false;
let player1 = false;
let player2 = false;
let clientId = 0;
let roomId = 0;
let count = 0;
let waitingUsers = [];

app.set('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('top');
});

app.get('/waiting', (req, res) => {
    //ユーザにIDを割り振り，waitingキューに追加
    clientId++;
    waitingUsers.push(clientId);
    console.log(`waitingUsers:${waitingUsers}`);
    res.render('waiting', { clientId: clientId });
    matching();
});

function matching() {
    //待ちキューが奇数or空になるまでペアをマッチングする
    while(waitingUsers.length !== 0 && waitingUsers.length % 2 == 0) {
        if (waitingUsers[0] && waitingUsers[1]) {
            let selectedUsers = [];
            selectedUsers.push(waitingUsers[0]);
            selectedUsers.push(waitingUsers[1]);
            waitingUsers.shift();
            waitingUsers.shift();

            io.on('connection', socket => {
                socket.broadcast.emit('match', {
                    'users': selectedUsers,
                    'roomId': roomId
                });
                socket.join(roomId);
            });
            roomId++;

            console.log(`User ${selectedUsers} matched!`);
        }
    }
}

//2人の待ちユーザをマッチング
function matchTwoUsers() {
    let selectedUsers = [];
    selectedUsers.push(waitingUsers[0]);
    selectedUsers.push(waitingUsers[1]);
    waitingUsers.shift();
    waitingUsers.shift();
    //socketioの処理
    io.on('connection', socket => {
        count++;
        socket.broadcast.emit('match', {
            'users': selectedUsers,
            'roomId': roomId
        });
        socket.join(roomId);
        if (count % 2 === 0){ roomId++; }
    });
    console.log(`User ${selectedUsers} matched!`);
    
}

app.get('/vs-player', (req, res) => {
    if (player1 === false) {
        res.render('vsPlayer', { playerNum: 1 });
        player1 = true;
        console.log("player1 joined");
    } else if (player2 === false) {
        res.render('vsPlayer', { playerNum: 2 });
        player2 = true;
        console.log("player2 joined");
    }

    if (player1 === true && player2 === true) {
        player1 = false;
        player2 = false;
    }
});

app.get('/vs-computer', (req, res) => {
    res.render('vsComputer');
});

app.get('/playground', (req, res) => {
    res.render('playground');
});

//socketioの処理
io.on('connection', socket => {

    //クライアントからコードが送られてきたらクライアントへ送り返す
    socket.on('player1', msg => {
        io.to(msg.roomId).emit('player1', {
            "player1Code": msg.player1Code,
        });
    });

    socket.on('player2', msg => {
        io.to(msg.roomId).emit('player2', {
            "player2Code": msg.player2Code,
        });
    });

    socket.on('create', msg => {
        io.to(msg.roomId).emit('create', {
            code: msg.code
        });
    });

    socket.on('gameEnd', msg => {
        console.log(`${msg.roomId} Game End`);
        // clientNum = 0;
    });

    //クライアントの接続が切れた時の処理
    socket.on('waitingUserDisconnected', msg => {
        waitingUsers.forEach((u, i) => {
            if(parseInt(msg.clientId, 10) === parseInt(u, 10)) {
                waitingUsers.splice(i, 1);
            }
        });
        console.log(`client ${msg.clientId} disconnected`);
        console.log(`waitingUsers: ${waitingUsers}`);
    });


    // socket.on('playerDisconnected', (player) => {
    //     console.log(`player ${player.playerNum} disconnected`);
    // });
    socket.on('playerDisconnected', msg => {
        socket.to(msg.roomId).emit('disconnected', {
            'info': 'disconnected'
        });
    });
});

http.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

