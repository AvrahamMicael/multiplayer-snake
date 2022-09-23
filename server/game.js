const { gridSize, frameRate } = require('./constants');
const { makeId } = require('./utils');

const createGameState = () => ({
    players: [
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
        },
    ],
    food: {},
    gridSize,
});

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
    const stateOnGameOver = winner => ({
        winner,
        playersQty: state.players.length,
    });
    const playerOne = state.players[0];
    const playerTwo = state.players[1];

    playerOne.pos.x += playerOne.vel.x;
    playerOne.pos.y += playerOne.vel.y;

    playerTwo.pos.x += playerTwo.vel.x;
    playerTwo.pos.y += playerTwo.vel.y;

    if(playerOne.pos.x < 0
    || playerOne.pos.x > gridSize
    || playerOne.pos.y < 0
    || playerOne.pos.y > gridSize)
    {
        return stateOnGameOver(2);
    }
    if(playerTwo.pos.x < 0
    || playerTwo.pos.x > gridSize
    || playerTwo.pos.y < 0
    || playerTwo.pos.y > gridSize)
    {
        return stateOnGameOver(1);
    }

    if(state.food.x == playerOne.pos.x
    && state.food.y == playerOne.pos.y)
    {
        playerOne.snake.push({ ...playerOne.pos });
        playerOne.pos.x += playerOne.vel.x;
        playerOne.pos.y += playerOne.vel.y;
        randomFood(state);
    }
    if(state.food.x == playerTwo.pos.x
    && state.food.y == playerTwo.pos.y)
    {
        playerTwo.snake.push({ ...playerTwo.pos });
        playerTwo.pos.x += playerTwo.vel.x;
        playerTwo.pos.y += playerTwo.vel.y;
        randomFood(state);
    }

    if(playerOne.vel.x
    || playerOne.vel.y)
    {
        for(let snake1Cell of playerOne.snake)
        {
            if(snake1Cell.x == playerOne.pos.x
            && snake1Cell.y == playerOne.pos.y)
            {
                return stateOnGameOver(2);
            }
        }
        for(let snake2Cell of playerTwo.snake)
        {
            if(snake2Cell.x == playerOne.pos.x
            && snake2Cell.y == playerOne.pos.y)
            {
                return stateOnGameOver(2);
            }
        }
    }
    if(playerTwo.vel.x
    || playerTwo.vel.y)
    {
        for(let snake2Cell of playerTwo.snake)
        {
            if(snake2Cell.x == playerTwo.pos.x
            && snake2Cell.y == playerTwo.pos.y)
            {
                return stateOnGameOver(1);
            }
        }
        for(let snake1Cell of playerOne.snake)
        {
            if(snake1Cell.x == playerTwo.pos.x
            && snake1Cell.y == playerTwo.pos.y)
            {
                return stateOnGameOver(1);
            }
        }
    }

    playerOne.snake.push({ ...playerOne.pos });
    playerOne.snake.shift();

    playerTwo.snake.push({ ...playerTwo.pos });
    playerTwo.snake.shift();

    return false;
};

const startGameInterval = (gameCode, states, io) => {
    const intervalId = setInterval(() => {
        let state = states[gameCode];
        const winner = gameLoop(state);
        if(!winner)
        {
            io.sockets.in(gameCode)
                .emit('gameState', state);
        }
        else
        {
            io.sockets.in(gameCode)
                .emit('gameOver', winner);
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


const initGame = () => {
    const state = createGameState();
    randomFood(state);
    return state;
};

const handleNewGame = (clientRooms, client, states) => {
    const roomName = makeId();
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    states[roomName] = initGame();

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
    if(roomSize > 1)
    {
        client.emit('tooManyPlayers');
        return;
    }

    clientRooms[client.id] = gameCode;
    client.join(gameCode);
    client.number = 2;
    client.emit('init', 2);

    startGameInterval(gameCode, states, io);
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
                states[roomName] = initGame();
                startGameInterval(roomName, states, io);
            }
        }, 1000);
    }
};

const handleDontPlayAgain = (client, states, clientRooms, io, playerNumber) => {
    const roomName = clientRooms[client.id];
    states[roomName].players[playerNumber - 1].playAgain = false;
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
    client.on('newGame', () => handleNewGame(clientRooms, client, states));
    client.on('joinGame', gameCode => handleJoinGame(gameCode, client, io, clientRooms, states));
    client.on('keyDown', key => handleKeyDown(key, client, states, clientRooms));
    client.on('playAgain', playerNumber => handlePlayAgain(client, states, clientRooms, io, playerNumber));
    client.on('dontPlayAgain', playerNumber => handleDontPlayAgain(client, states, clientRooms, io, playerNumber));
};

module.exports = {
    handleConnection,
};
