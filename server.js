const express = require('express');
const http = require('http');

const app = express();

// use static
app.use(express.static('public'));

// set view
app.set('view engine', 'ejs');
app.set('views', './views');

const server = http.createServer(app);
const io = require('socket.io')(server);
io.on('connection', function(socket) {
    console.log('Some one connected: ' + socket.id);
    socket.on('CREATE_ROOM', function(data) {
        socket.join(data);
        socket.Phong = data;
        const arrRoom = [];
        for(i in socket.adapter.rooms) {
            arrRoom.push(i);
        }
        io.sockets.emit("SEVER-SEND-ALL", arrRoom)
        socket.emit('SEVER-SEND-ONE', data);
    });
    socket.on('CHAT-IN-ROOM', function(data){
        io.sockets.in(socket.Phong).emit("SEVER-CHAT", data);
    });
    socket.on('CLIENT-SEND-SERVER', function(data) {
        console.log(data);
    });
});

app.get('/', (req, res) => {
    res.render('index');
});

server.listen(3000);