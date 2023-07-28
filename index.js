const express = require('express');
const app = express();
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dotenv = require('dotenv');
const PORT = process.env.PORT || 3000;

let player1 = false;
let player2 = false;
let clientId = 0;
let roomId = 1;
let activeRooms = [];
let waitingUsers = [];
let matchCount = 0;

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
                matchCount++;
                socket.join(roomId);

                if (matchCount % 2 === 0) {
                    let index = activeRooms.indexOf(parseInt(roomId, 10));
                    if (index === -1) {
                        activeRooms.push(roomId);
                    }
                    console.log(`active rooms: ${activeRooms}`);
                }

            });
            roomId++;
            console.log(`User ${selectedUsers} matched!`);
        }
    }
}

app.set('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (_, res) => {
    res.render('top');
});

app.get('/waiting', (_, res) => {
    //ユーザにIDを割り振り，waitingキューに追加
    clientId++;
    waitingUsers.push(clientId);
    console.log(`waitingUsers:${waitingUsers}`);
    res.render('waiting', { clientId: clientId });
    matching();
});


app.get('/vs-player', (req, res) => {
    //ここの処理もっとよくできそう
    if (!player1) {
        res.render('vsPlayer', { playerNum: 1 });
        player1 = true;
        // console.log("player1 joined");
    } else if (!player2) {
        res.render('vsPlayer', { playerNum: 2 });
        player2 = true;
        // console.log("player2 joined");
    }

    if (player1 && player2) {
        player1 = false;
        player2 = false;
    }

});

app.get('/vs-computer', (_, res) => {
    res.render('vsComputer');
});

app.get('/playground', (_, res) => {
    res.render('playground');
});

app.get('/observer', (_, res) => {
    res.render('observer', { activeRooms });
});

//socketioの処理
io.on('connection', socket => {
    //プレイヤーから送られてきた戦略のコードを同じroomのプレイヤーに送る
    socket.on('player1', msg => {
        let query = {
            text: 'INSERT INTO code_log (code, timestamp) VALUES($1, current_timestamp)',
            values: [msg.player1Code]
        };
        io.to(msg.roomId).emit('player1', {
            "player1Code": msg.player1Code,
        });
    });

    socket.on('player2', msg => {
        const query = {
            text: 'INSERT INTO code_log (code, timestamp) VALUES($1, current_timestamp)',
            values: [msg.player2Code]
        };

        io.to(msg.roomId).emit('player2', {
            "player2Code": msg.player2Code,
        });
    });

    socket.on('vscomputer', msg => {
        const query = {
            text: 'INSERT INTO vscomputer_code_log (code, timestamp) VALUES($1, current_timestamp)',
            values: [msg.code]
        };
    });

    socket.on('create', msg => {
        io.to(msg.roomId).emit('create', {
            code: msg.code
        });
    });

    //ゲームが終了した時の処理
    socket.on('gameEnd', msg => {
        console.log(`${msg.roomId} Game over`);
    });

    //クライアント(待ちユーザ)の接続が切れた時の処理
    socket.on('waitingUserDisconnected', msg => {
        waitingUsers.forEach((u, i) => {
            if(parseInt(msg.clientId, 10) === parseInt(u, 10)) {
                waitingUsers.splice(i, 1);
            }
        });
        console.log(`client ${msg.clientId} disconnected`);
    });

    //プレイヤーの接続が切れた時の処理
    socket.on('playerDisconnected', msg => {
        socket.to(msg.roomId).emit('disconnected', {
            'info': 'disconnected'
        });
        //activeRoomsから指定の要素を削除する
        const index = activeRooms.indexOf(parseInt(msg.roomId, 10));
        if (index > -1) {
            activeRooms.splice(index, 1);
        }
        console.log(`active rooms: ${activeRooms}`);
    });
});

http.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`Server is up on ${url}`);
});

http.on('close', (e) => {
    console.log('closed');
});
