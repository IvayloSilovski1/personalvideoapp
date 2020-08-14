const express = require('express');
const app = express();

// create server for socket.io
const server = require('http').Server(app);

// pass server to socket.io => so socket.io knows what server to use
const io = require('socket.io')(server);

const { v4: uuidV4 } = require('uuid');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// main route which redirects to a specific new created room
app.get('/', (req, res) => {
    res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
    res.render('room', {
        roomId: req.params.room
    })
})

// every time someone connects to our room
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // console.log(roomId, userId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected');
        })
    })
})

server.listen(3000, console.log(`Server started on port 3000`));