const { gridSize } = require('./constants');
const { makeId } = require('./utils');

const getPlayers = playersQty => [
        {
            pos: {
                x: 3,
                y: 2,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 2 },
                { x: 2, y: 2 },
                { x: 3, y: 2 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 17,
                y: 18,
            },
            vel: {
                x: -1,
                y: 0,
            },
            snake: [
                { x: 19, y: 18 },
                { x: 18, y: 18 },
                { x: 17, y: 18 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 3,
                y: 7,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 7 },
                { x: 2, y: 7 },
                { x: 3, y: 7 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 17,
                y: 13,
            },
            vel: {
                x: -1,
                y: 0,
            },
            snake: [
                { x: 19, y: 13 },
                { x: 18, y: 13 },
                { x: 17, y: 13 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 3,
                y: 12,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 12 },
                { x: 2, y: 12 },
                { x: 3, y: 12 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 17,
                y: 8,
            },
            vel: {
                x: -1,
                y: 0,
            },
            snake: [
                { x: 19, y: 8 },
                { x: 18, y: 8 },
                { x: 17, y: 8 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 3,
                y: 17,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                { x: 1, y: 17 },
                { x: 2, y: 17 },
                { x: 3, y: 17 },
            ],
            playAgain: false,
            lost: false,
        },
        {
            pos: {
                x: 17,
                y: 3,
            },
            vel: {
                x: -1,
                y: 0,
            },
            snake: [
                { x: 19, y: 3 },
                { x: 18, y: 3 },
                { x: 17, y: 3 },
            ],
            playAgain: false,
            lost: false,
        },
    ].slice(0, playersQty);

const createGameState = ({ playersQty, frameRate }) => {
    if(typeof frameRate != 'number' || frameRate < 1) frameRate = 4;
    if(typeof playersQty != 'number' || playersQty < 2 || playersQty > 8 || Math.floor(playersQty) != playersQty) playersQty = 2;
    const players = getPlayers(playersQty);
    return {
        players,
        gridSize,
        frameRate,
        foods: [],
    };
};

const randomFood = (state, foodEatenIndex = null, foodQtyOnCreate = 1) => {
    const genFood = () => ({
        x: Math.floor( Math.random() * gridSize ),
        y: Math.floor( Math.random() * gridSize ),
    });
    
    const newFoods = [];
    const stateFoodQty = state.foods.length;
    if(stateFoodQty == 0)
    {
        for(let i = 0; i < foodQtyOnCreate; i++)
        {
            newFoods.push(genFood());
        }
    }
    if(typeof foodEatenIndex == 'number')
    {
        state.foods.splice(foodEatenIndex, 1);
        newFoods.push(...state.foods);
        newFoods.push(genFood());
    }

    for(const [ foodIndex, food ] of newFoods.entries())
    {
        const newFoodsClone = newFoods.splice();
        for(const otherFood of newFoodsClone.splice(foodIndex, 1))
        {
            if(otherFood.x == food.x
            && otherFood.y == food.y)
            {
                return randomFood(state);
            }
        }
        for(const player of state.players)
        {
            for(const cell of player.snake)
            {
                if(cell.x == food.x 
                && cell.y == food.y)
                {
                    return randomFood(state);
                }
            }
        }
    }

    state.foods = newFoods;
};

const gameLoop = (state, io, roomName) => {
    let wonGameStateData = null;
    const stateOnGameOver = () => ({
        playersQty: state.players.length,
    });

    state.players.forEach((player, _, players) => {
        if(player.lost) return;
        let lost = false;

        player.pos.x += player.vel.x;
        player.pos.y += player.vel.y;

        if(player.pos.x < 0
        || player.pos.x > gridSize
        || player.pos.y < 0
        || player.pos.y > gridSize)
        {
            lost = true;
        }


        for(const [ foodIndex, food ] of state.foods.entries())
        {
            if(food.x == player.pos.x
            && food.y == player.pos.y)
            {
                player.snake.push({ ...player.pos });
                player.pos.x += player.vel.x;
                player.pos.y += player.vel.y;
                randomFood(state, foodIndex);
            }
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
                        lost = true;
                    }
                    if(lost) break;
                }
                if(lost) break;
            }
        }

        if(lost)
        {
            player.pos = {};
            player.vel = {};
            player.snake = [];
            player.lost = true;

            const alivePlayers = players.filter(player => !player.lost);
            if(alivePlayers.length > 1)
            {
                io.sockets
                    .in(roomName)
                    .emit('snakeLost', {
                        snake: player.snake,
                        size: state.gridSize,
                    });
                return;
            }
            wonGameStateData = stateOnGameOver();
            return;
        }
        player.snake.push({ ...player.pos });
        player.snake.shift();
    });

    return wonGameStateData;
};

const startGameInterval = (roomName, states, io) => {
    const state = states[roomName];
    const intervalId = setInterval(() => {
        const wonGameData = gameLoop(state, io, roomName);
        if(!wonGameData)
        {
            io.sockets
                .in(roomName)
                .emit('gameState', state);
            return;
        }
        let winnerNumber;
        state.players.some((player, index) => {
            winnerNumber = index + 1;
            return !player.lost;
        });
        io.sockets
            .in(roomName)
            .emit('gameOver', {
                winnerNumber,
                playersQty: wonGameData.playersQty,
            });
        clearInterval(intervalId);
    }, 1000 / state.frameRate);
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
    if(!vel) return;
    const player = states[roomName].players[client.number - 1];
    if(!Object.keys(player.vel).length) return;
    if(Math.abs(vel.x) == Math.abs(player.vel.x)) return;
    const playerNextPosX = player.pos.x + vel.x;
    const playerNextPosY = player.pos.y + vel.y;
    const playerSnakeSecondCell = player.snake[player.snake.length - 2];
    if(playerSnakeSecondCell.x == playerNextPosX && playerSnakeSecondCell.y == playerNextPosY) return;
    player.vel = vel;
};


const initGame = gameStateSettings => {
    const state = createGameState(gameStateSettings);
    let { foodQty } = gameStateSettings;
    if(typeof foodQty != 'number' || foodQty < 1 || foodQty > 10) foodQty = 1;
    randomFood(state, null, foodQty);
    return state;
};

const handleNewGame = (clientRooms, client, states, gameStateSettings) => {
    const roomName = makeId();
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    states[roomName] = initGame(gameStateSettings);

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
    const { players, frameRate, foods } = states[roomName];

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
                states[roomName] = initGame({
                    playersQty: players.length,
                    foodQty: foods.length,
                    frameRate,
                });
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
    client.on('newGame', gameStateSettings => handleNewGame(clientRooms, client, states, gameStateSettings));
    client.on('joinGame', gameCode => handleJoinGame(gameCode, client, io, clientRooms, states));
    client.on('keyDown', key => handleKeyDown(key, client, states, clientRooms));
    client.on('playAgain', playerNumber => handlePlayAgain(client, states, clientRooms, io, playerNumber));
    client.on('dontPlayAgain', playerNumber => handleDontPlayAgain(client, clientRooms, io, playerNumber));
};

module.exports = {
    handleConnection,
};
