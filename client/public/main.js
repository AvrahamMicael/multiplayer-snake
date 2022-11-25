import { io } from "https://cdn.socket.io/4.5.0/socket.io.esm.min.js";

const socket = io('https://multiplayer-snake-server.onrender.com', { 
    widthCredentials: false,
});

const isMobile = (() => {
    let check = false;
    (a => {if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
})();

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
const playersQtyInput = document.getElementById('playersQtyInput');
const playersQtySpan = document.getElementById('playersQtySpan');
const settingsButton = document.getElementById('settingsButton');
const settingsDiv = document.getElementById('settingsDiv');
const gameEnterDiv = document.getElementById('gameEnterDiv');
const velocityInput = document.getElementById('velocityInput');
const velocitySpan = document.getElementById('velocitySpan');
const foodQtyInput = document.getElementById('foodQtyInput');
const foodQtySpan = document.getElementById('foodQtySpan');

const bgColor = 'black';
const snakeColors = [ 'blue', 'green', 'white', 'purple', 'yellow', 'pink', 'brown', 'orange' ];
const foodColor = 'red';

let canvas, ctx, playerNumber;
let gameActive = false;
let touchStartX = null;
let touchStartY = null;

const paintPlayer = (playerState, size, color) => {
    ctx.fillStyle = color;
    if(!playerState.lost) playerState.snake.forEach(position => {
        ctx.fillRect(position.x * size, position.y * size, size, size)
    });
};

const paintGame = state => {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const foods = state.foods;
    const gridSize = state.gridSize;
    const size = canvas.width / gridSize;

    ctx.fillStyle = foodColor;
    foods.forEach(food => ctx.fillRect(food.x * size, food.y * size, size, size))

    state.players.map((player, playerIndex) => paintPlayer(player, size, snakeColors[playerIndex]));
};

const handleSnakeLost = ({ snake, size }) => {
    ctx.fillStyle = bgColor;
    snake.forEach(position => {
        ctx.fillRect(position.x * size, position.y * size, size, size);
    });
};

const onKeyDown = ev => {
    socket.emit('keyDown', ev.key);
};

const changePlayersQty = ev => {
    if(!/^[2-8]$/.test(ev.currentTarget.value))
    {
        ev.currentTarget.value = 2;
    }
    playersQtySpan.textContent = ev.currentTarget.value;
};

const onTouchStart = ev => {
    const firstTouch = ev.touches[0];
    touchStartX = firstTouch.clientX;
    touchStartY = firstTouch.clientY;
};

const onTouchMove = ev => {
    if(!touchStartX || !touchStartY) return;
    const firstTouch = ev.touches[0];
    const touchMoveX = firstTouch.clientX;
    const touchMoveY = firstTouch.clientY;
    
    const diffX = touchMoveX - touchStartX;
    const diffY = touchMoveY - touchStartY;

    socket.emit('keyDown',
        Math.abs(diffX) > Math.abs(diffY)
            ? diffX > 0
                ? 'ArrowRight'
                : 'ArrowLeft'
            : diffY > 0
                ? 'ArrowDown'
                : 'ArrowUp'
    );

    touchStartX = null;
    touchStartY = null;
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

const getElementComputedStyleDisplay = element => window.getComputedStyle(element).getPropertyValue('display');

const toggleSettings = () => {
    const [ settingsDivDisplay, gameEnterDivDisplay ] = getElementComputedStyleDisplay(settingsDiv) == 'none'
        ? [ 'block', 'none' ]
        : [ 'none', 'block' ];
    settingsDiv.style.display = settingsDivDisplay;
    gameEnterDiv.style.display = gameEnterDivDisplay;
};

const setSettingsFromCache = () => {
    const frameRate = localStorage.frameRate || 4;
    velocitySpan.textContent = frameRate;
    velocityInput.value = frameRate;
    const foodQty = localStorage.foodQty || 1;
    foodQtySpan.textContent = foodQty;
    foodQtyInput.value = foodQty;
};

const changeVelocitySpanAndCache = ev => {
    const value = ev.currentTarget.value;
    velocitySpan.textContent = value;
    localStorage.frameRate = value;
};

const changeFoodQtySpanAndCache = ev => {
    const value = ev.currentTarget.value;
    foodQtySpan.textContent = value;
    localStorage.foodQty = value;
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

const handleGameOver = ({ winnerNumber, playersQty }) => {
    if(!gameActive) return;
    gameActive = false;

    winnerTextH5.textContent = `${ winnerNumber == playerNumber ? 'You' : `Player ${winnerNumber}` } Win!`;

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
    if(isMobile)
    {
        canvas.style.width  = '100%';
        canvas.style.height = '70%';
    }
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    document.addEventListener('touchstart', onTouchStart);
    document.addEventListener('touchmove', onTouchMove);
    document.addEventListener('keydown', onKeyDown);
    gameActive = true;
};

const newGame = () => {
    socket.emit('newGame', {
        playersQty: playersQtyInput.valueAsNumber,
        frameRate: velocityInput.valueAsNumber,
        foodQty: foodQtyInput.valueAsNumber,
    });
    if(isMobile) document.body.requestFullscreen();
    init();
};

const joinGame = () => {
    const code = gameCodeInput.value;
    socket.emit('joinGame', code);
    if(isMobile) document.body.requestFullscreen();
    init();
};

const onGameCodeKeyDown = ev => {
    if(ev.key == 'Enter') joinGame();
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
    if(isMobile) document.body.requestFullscreen();
};

const handleInit = playerNum => {
    playerNumber = playerNum;
    playerNumberH5.textContent = `Player ${playerNumber}`;
};


settingsButton.addEventListener('click', toggleSettings);
playersQtyInput.addEventListener('change', changePlayersQty)
velocityInput.addEventListener('input', changeVelocitySpanAndCache)
foodQtyInput.addEventListener('input', changeFoodQtySpanAndCache)
newGameButton.addEventListener('click', newGame);
gameCodeInput.addEventListener('keydown', onGameCodeKeyDown);
joinGameButton.addEventListener('click', joinGame);
setSettingsFromCache();

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
socket.on('snakeLost', handleSnakeLost);
socket.on('reset', reset);
