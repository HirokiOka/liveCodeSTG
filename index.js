const { Client } = require('pg');
const express = require('express');
const app = express();
const ejs = require('ejs');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const dotenv = require('dotenv');
dotenv.config();

const port = 3000;
let dbClient = new Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
});
let player1 = false;
let player2 = false;
let clientId = 0;
let roomId = 1;
let activeRooms = [];
let count = 0;
let waitingUsers = [];
let matchCount = 0;



app.set('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

dbClient.connect()
            .then(() => console.log('DB Connected successfully'));

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

app.get('/vs-player', (req, res) => {
    //ここの処理もっとよくできそう
    if (player1 === false) {
        res.render('vsPlayer', { playerNum: 1 });
        player1 = true;
        // console.log("player1 joined");
    } else if (player2 === false) {
        res.render('vsPlayer', { playerNum: 2 });
        player2 = true;
        // console.log("player2 joined");
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

app.get('/observer', (req, res) => {
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

        dbClient.query(query, (err, res) => {
            console.log(err, res);
        });

        io.to(msg.roomId).emit('player1', {
            "player1Code": msg.player1Code,
        });
    });

    socket.on('player2', msg => {
        let query = {
            text: 'INSERT INTO code_log (code, timestamp) VALUES($1, current_timestamp)',
            values: [msg.player2Code]
        };
        dbClient.query(query, (err, res) => {
            console.log(err, res);
        });

        io.to(msg.roomId).emit('player2', {
            "player2Code": msg.player2Code,
        });
    });

    socket.on('create', msg => {
        io.to(msg.roomId).emit('create', {
            code: msg.code
        });
    });

    //ゲームが終了した時の処理
    socket.on('gameEnd', msg => {
        console.log(`${msg.roomId} Game End`);
    });

    //クライアント(待ちユーザ)の接続が切れた時の処理
    socket.on('waitingUserDisconnected', msg => {
        waitingUsers.forEach((u, i) => {
            if(parseInt(msg.clientId, 10) === parseInt(u, 10)) {
                waitingUsers.splice(i, 1);
            }
        });
        console.log(`client ${msg.clientId} disconnected`);
        // console.log(`waitingUsers: ${waitingUsers}`);
    });

    //プレイヤーの接続が切れた時の処理
    socket.on('playerDisconnected', msg => {
        socket.to(msg.roomId).emit('disconnected', {
            'info': 'disconnected'
        });
        //activeRoomsから指定の要素を削除する
        let index = activeRooms.indexOf(parseInt(msg.roomId, 10));
        if (index > -1) {
            activeRooms.splice(index, 1);
        }
        console.log(`active rooms: ${activeRooms}`);
    });
});

http.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

http.on('close', (e) => {
    dbClient.end();
    console.log('closed');
})