const { gridSize, frameRate } = require('./constants');
const { makeId } = require('./utils');

const createGameState = playersQty => {
    const players = [
        {
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 10 },
                { x: 2, y: 10 },
                { x: 3, y: 10 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 3,
                y: 5,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 5 },
                { x: 2, y: 5 },
                { x: 3, y: 5 },
            ],
            playAgain: false,
            lost: false,
        },
    ];

    if(playersQty == 3) players.push({
        pos: {
            x: 3,
            y: 15,
        },
        vel: {
            x: 1,
            y: 0,
        },
        snake: [
            { x: 1, y: 15 },
            { x: 2, y: 15 },
            { x: 3, y: 15 },
        ],
        playAgain: false,
        lost: false,
    });

    return {
        players,
        gridSize,
        food: {},
    };
};

const randomFood = state => {
    const food = {
        x: Math.floor( Math.random() * gridSize ),
        y: Math.floor( Math.random() * gridSize ),
    };

    for(let cell in state.players[0].snake)
    {
        if(cell.x == food.x 
        && cell.y == food.y)
        {
            return randomFood(state);
        }
    }
    for(let cell in state.players[1].snake)
    {
        if(cell.x == food.x 
        && cell.y == food.y)
        {
            return randomFood(state);
        }
    }

    state.food = food;
};

const gameLoop = state => {
    let loserData = null;
    const stateOnGameOver = loser => {
        state.players[loser - 1].lost = true;
        return {
            loser,
            playersQty: state.players.length,
        };
    };

    const checkIfSomeoneLost = () => {
        state.players.every((player, playerIndex, players) => {
            const playerNumber = playerIndex + 1;
            player.pos.x += player.vel.x;
            player.pos.y += player.vel.y;

            if(player.pos.x < 0
            || player.pos.x > gridSize
            || player.pos.y < 0
            || player.pos.y > gridSize)
            {
                loserData = stateOnGameOver(playerNumber);
            }

            if(state.food.x == player.pos.x
            && state.food.y == player.pos.y)
            {
                player.snake.push({ ...player.pos });
                player.pos.x += player.vel.x;
                player.pos.y += player.vel.y;
                randomFood(state);
            }
            
            if(player.vel.x
            || player.vel.y)
            {
                for(const arrayPlayer of players)
                {
                    for(const snakeCell of arrayPlayer.snake)
                    {
                        if(snakeCell.x == player.pos.x
                        && snakeCell.y == player.pos.y)
                        {
                            loserData = stateOnGameOver(playerNumber);
                        }
                    }
                }
            }

            if(loserData)
            {
                player.pos = {};
                player.vel = {};
                player.snake = [];
            }
            else
            {
                player.snake.push({ ...player.pos });
                player.snake.shift();
            }

            return loserData
                ? players.filter(player => !player.lost).length > 1
                : true;
        });
    };

    checkIfSomeoneLost();

    return loserData;
};

const startGameInterval = (gameCode, states, io) => {
    const intervalId = setInterval(() => {
        let state = states[gameCode];
        const loserData = gameLoop(state);
        if(!loserData)
        {
            io.sockets.in(gameCode)
                .emit('gameState', state);
        }
        else if(state.players.filter(player => !player.lost).length > 1)
        {
            io.sockets.in(gameCode)
                .emit('snakeLost', {
                    snake: state.players[loserData.loser - 1].snake,
                    size: state.gridSize,
                });
        }
        else
        {
            let winnerNumber;
            state.players.some((player, index) => {
                winnerNumber = index + 1;
                return !player.lost;
            });
            io.sockets.in(gameCode)
                .emit('gameOver', {
                    winnerNumber,
                    playersQty: loserData.playersQty,
                });
            state = null;
            clearInterval(intervalId);
        }
    }, 1000 / frameRate);
};

const getUpdatedVelocity = key => {
    switch(key)
    {
        case 'ArrowLeft':
            return { x: -1, y: 0 };
        case 'ArrowDown':
            return { x: 0, y: 1 };
        case 'ArrowRight':
            return { x: 1, y: 0 };
        case 'ArrowUp':
            return { x: 0, y: -1 };
    }
};

const handleKeyDown = (key, client, states, clientRooms) => {
    const roomName = clientRooms[client.id];
    if(!roomName) return;
    const vel = getUpdatedVelocity(key);
    if(vel)
    {
        states[roomName].players[client.number - 1].vel = vel;
    }
};


const initGame = playersQty => {
    const state = createGameState(playersQty);
    randomFood(state);
    return state;
};

const handleNewGame = (clientRooms, client, states, playersQty) => {
    const roomName = makeId();
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    states[roomName] = initGame(playersQty);

    client.join(roomName);
    client.number = 1;
    client.emit('init', 1);
};


const handleJoinGame = (gameCode, client, io, clientRooms, states) => {
    const room = io.sockets.adapter.rooms.get(gameCode);
    
    let roomSize;
    if(room) roomSize = room.size;

    if(!roomSize)
    {
        client.emit('unknownGame');
        return;
    }

    const playersQty = states[gameCode].players.length;
    if(roomSize >= playersQty)
    {
        client.emit('tooManyPlayers');
        return;
    }

    clientRooms[client.id] = gameCode;
    client.join(gameCode);
    client.number = roomSize + 1;
    client.emit('init', client.number);

    if(client.number == playersQty) startGameInterval(gameCode, states, io);
};

const handlePlayAgain = (client, states, clientRooms, io, playerNumber) => {
    const roomName = clientRooms[client.id];
    const players = states[roomName].players;

    players[client.number - 1].playAgain = true;
    io.sockets.in(roomName).emit('playAgainMarked', playerNumber);

    if(players.every(player => player.playAgain))
    {
        let timeToPlayAgain = 5;
        const intervalId = setInterval(() => {
            if(timeToPlayAgain)
            {
                io.sockets.in(roomName).emit('counter', timeToPlayAgain--);
            }
            else
            {
                clearInterval(intervalId);
                io.sockets.in(roomName).emit('prepareToPlayAgain');
                states[roomName] = initGame(players.length);
                startGameInterval(roomName, states, io);
            }
        }, 1000);
    }
};

const handleDontPlayAgain = (client, clientRooms, io, playerNumber) => {
    const roomName = clientRooms[client.id];
    io.sockets.in(roomName).emit('dontPlayAgainMarked', playerNumber);
    let timeToReset = 5;
    const intervalId = setInterval(() => {
        if(!timeToReset)
        {
            clearInterval(intervalId);
            io.sockets.in(roomName).emit('reset');
            io.sockets.in(roomName).socketsLeave(roomName);
            return;
        }
        io.sockets.in(roomName).emit('counter', timeToReset--);
    }, 1000);
};

const handleConnection = (client, states, clientRooms, io) => {
    client.on('newGame', playersQty => handleNewGame(clientRooms, client, states, playersQty));
    client.on('joinGame', gameCode => handleJoinGame(gameCode, client, io, clientRooms, states));
    client.on('keyDown', key => handleKeyDown(key, client, states, clientRooms));
    client.on('playAgain', playerNumber => handlePlayAgain(client, states, clientRooms, io, playerNumber));
    client.on('dontPlayAgain', playerNumber => handleDontPlayAgain(client, clientRooms, io, playerNumber));
};

module.exports = {
    handleConnection,
};
