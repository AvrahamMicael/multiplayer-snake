const { handleConnection } = require('./game');
const httpServer = require('http').createServer();
const io = require('socket.io')(httpServer, {
    cors: {
        origin: '*',
        methods: ['get', 'post'],
        credentials: false,
    },
});

const states = {};
const clientRooms = {};

io.on('connection', client => handleConnection(client, states, clientRooms, io));

httpServer.listen(process.env.PORT || 3000);
