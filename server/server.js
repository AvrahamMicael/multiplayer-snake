const { handleConnection } = require('./game');
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: 'http://127.0.0.1:8080',
        methods: ['get', 'post'],
        credentials: false,
    },
});

const states = {};
const clientRooms = {};

io.on('connection', client => handleConnection(client, states, clientRooms, io));

io.listen(process.env.PORT || 3000);
