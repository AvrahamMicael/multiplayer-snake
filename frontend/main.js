const socket = io('https://multiplayer---snake.herokuapp.com', {
    widthCredentials: false,
});

const initialScreen = document.getElementById('initialScreen');
const gameScreen = document.getElementById('gameScreen');
const newGameButton = document.getElementById('newGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const gameCodeSpan = document.getElementById('gameCodeSpan');
const playAgainList = document.getElementById('playAgainList');
const popupOuter = document.getElementById('popupOuter');
const winnerTextH5 = document.getElementById('winnerText');
const playerNumberH5 = document.getElementById('playerNumber');
const playAgainButtonsDiv = document.getElementById('playAgainButtonsDiv');

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

const createPlayAgainListItem = playerNumber => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    const icon = document.createElement('i');
    icon.className = 'fas fa-circle-notch fa-spin text-primary';
    icon.id = `icon-${playerNumber}`;
    li.appendChild(icon);
    const playerNameSpan = document.createElement('span');
    playerNameSpan.textContent = ` - Player ${playerNumber}`;
    li.appendChild(playerNameSpan);
    playAgainList.appendChild(li);
};

const playAgainButtonOnClick = () => {
    socket.emit('playAgain', playerNumber);
};

const dontPlayaAgainButtonOnClick = () => {
    socket.emit('dontPlayAgain', playerNumber);
};

const createPlayAgainButtons = () => {
    const yesButton = document.createElement('button');
    const noButton = document.createElement('button');
    yesButton.className = 'btn btn-success me-2';
    noButton.className = 'btn btn-danger';
    yesButton.textContent = 'Yes';
    noButton.textContent = 'No';
    yesButton.onclick = () => socket.emit('playAgain', playerNumber);
    noButton.onclick = () => socket.emit('dontPlayAgain', playerNumber);
    yesButton.type = noButton.type = 'button';
    playAgainButtonsDiv.append(yesButton, noButton);
};

const handleGameOver = ({ winner, playersQty }) => {
    if(!gameActive) return;
    gameActive = false;

    winnerTextH5.textContent = `${ winner == playerNumber ? 'You' : `Player ${winner}` } Win!`;

    for(let i = 1; i <= playersQty; i++)
    {
        createPlayAgainListItem(i);
    }
    createPlayAgainButtons();

    popupOuter.style.display = 'flex';
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

const removePlayAgainButtons = () => {
    while(playAgainButtonsDiv.firstChild)
    {
        playAgainButtonsDiv.removeChild(playAgainButtonsDiv.lastChild);
    }
};

const removePlayAgainListItems = () => {
    while(playAgainList.firstChild)
    {
        playAgainList.removeChild(playAgainList.lastChild);
    }
};

const resetPopup = () => {
    removePlayAgainButtons();
    removePlayAgainListItems();
    popupOuter.style.display = 'none';
    winnerTextH5.textContent = '';
};

const reset = () => {
    playerNumber = null;
    gameCodeInput.value = '';
    gameCodeSpan.innerText = '';
    initialScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    resetPopup();
};

const handleUnknownGame = () => {
    reset();
    alert('Unknown game code');
};

const handleTooManyPlayers = () => {
    reset();
    alert('This game is already in progress');
};

const handlePlayAgainMarked = markedPlayerNumber => {
    const userIcon = document.getElementById(`icon-${markedPlayerNumber}`);
    userIcon.className = 'fa fa-check text-success';
    if(playerNumber == markedPlayerNumber) removePlayAgainButtons();
};

const handleDontPlayAgainMarked = markedPlayerNumber => {
    const userIcon = document.getElementById(`icon-${markedPlayerNumber}`);
    userIcon.className = 'fa-solid fa-x text-danger';
    removePlayAgainButtons();
};

const handleCounter = count => {
    playAgainButtonsDiv.textContent = count;
};

const handlePrepareToPlayAgain = () => {
    resetPopup();
    gameActive = true;
};

const handleInit = playerNum => {
    playerNumber = playerNum;
    playerNumberH5.textContent = `Player ${playerNumber}`;
};

newGameButton.addEventListener('click', newGame);
joinGameButton.addEventListener('click', joinGame);

socket.on('init', handleInit);
socket.on('unknownGame', handleUnknownGame);
socket.on('tooManyPlayers', handleTooManyPlayers);
socket.on('gameCode', handleGameCode);
socket.on('gameState', handleGameState);
socket.on('gameOver', handleGameOver);
socket.on('playAgainMarked', handlePlayAgainMarked);
socket.on('dontPlayAgainMarked', handleDontPlayAgainMarked);
socket.on('counter', handleCounter);
socket.on('prepareToPlayAgain', handlePrepareToPlayAgain);
socket.on('reset', reset);
