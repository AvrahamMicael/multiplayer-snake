const socket = io('http://localhost:3000', {
    widthCredentials: false,
});

const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeSpan = document.getElementById('gameCodeSpan');

const bgColor = 'black';
const snake1Color = 'blue';
const snake2Color = 'green';
const foodColor = 'red';

let canvas, ctx, playerNumber;
let gameActive = false;

const paintPlayer = (playerState, size, color) => {
    ctx.fillStyle = color;
    playerState.snake.forEach(position => ctx.fillRect(position.x * size, position.y * size, size, size));
};

const paintGame = state => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const food = state.food;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * size, food.y * size, size, size);

    paintPlayer(state.players[0], size, snake1Color);
    paintPlayer(state.players[1], size, snake2Color);
};

const onKeyDown = ev => {
    socket.emit('keyDown', ev.key);
};

const handleGameState = gameState => {
    if(!gameActive) return;
    requestAnimationFrame(() => paintGame(gameState));
};

const handleGameOver = loser => {
    if(!gameActive) return;
    gameActive = false;
    if(loser == playerNumber)
    {
        alert('You win!');
        return;
    }
    alert('You lose.');
};

const handleGameCode = roomName => {
    gameCodeSpan.innerText = roomName;
};

const init = () => {
    initialScreen.style.display = 'none';
    gameScreen.style.display = 'block';

    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');

    canvas.width = canvas.height = 600;
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('keydown', onKeyDown);
    gameActive = true;
};

const newGame = () => {
    socket.emit('newGame');
    init();
};

const joinGame = () => {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    init();
};

const reset = () => {
    playerNumber = null;
    gameCodeInput.value = '';
    gameCodeSpan.innerText = '';
    initialScreen.style.display = 'block';
    gameScreen.style.display = 'none';
};

const handleUnknownGame = () => {
    reset();
    alert('Unknown game code');
};

const handleTooManyPlayers = () => {
    reset();
    alert('This game is already in progress');
};

const handleInit = playerNum => {
    playerNumber = playerNum;
};

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);

socket.on('init', handleInit);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('gameCode', handleGameCode);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
