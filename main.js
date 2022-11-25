function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_unsupportedIterableToArray(e,t)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(e,t){var n;if(e)return"string"==typeof e?_arrayLikeToArray(e,t):"Map"===(n="Object"===(n=Object.prototype.toString.call(e).slice(8,-1))&&e.constructor?e.constructor.name:n)||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,a=new Array(t);n<t;n++)a[n]=e[n];return a}function _iterableToArrayLimit(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var a,o,i=[],r=!0,l=!1;try{for(n=n.call(e);!(r=(a=n.next()).done)&&(i.push(a.value),!t||i.length!==t);r=!0);}catch(c){l=!0,o=c}finally{try{r||null==n["return"]||n["return"]()}finally{if(l)throw o}}return i}}function _arrayWithHoles(e){if(Array.isArray(e))return e}import{io}from"https://cdn.socket.io/4.5.0/socket.io.esm.min.js";var canvas,ctx,playerNumber,socket=io("https://multiplayer-snake-server.onrender.com",{widthCredentials:!1}),isMobile=function(){var e,t=!1;return e=navigator.userAgent||navigator.vendor||window.opera,t=/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4))?!0:t}(),initialScreen=document.getElementById("initialScreen"),gameScreen=document.getElementById("gameScreen"),newGameButton=document.getElementById("newGameButton"),joinGameButton=document.getElementById("joinGameButton"),gameCodeInput=document.getElementById("gameCodeInput"),gameCodeSpan=document.getElementById("gameCodeSpan"),playAgainList=document.getElementById("playAgainList"),popupOuter=document.getElementById("popupOuter"),winnerTextH5=document.getElementById("winnerText"),playerNumberH5=document.getElementById("playerNumber"),playAgainButtonsDiv=document.getElementById("playAgainButtonsDiv"),playersQtyInput=document.getElementById("playersQtyInput"),playersQtySpan=document.getElementById("playersQtySpan"),settingsButton=document.getElementById("settingsButton"),settingsDiv=document.getElementById("settingsDiv"),gameEnterDiv=document.getElementById("gameEnterDiv"),velocityInput=document.getElementById("velocityInput"),velocitySpan=document.getElementById("velocitySpan"),foodQtyInput=document.getElementById("foodQtyInput"),foodQtySpan=document.getElementById("foodQtySpan"),bgColor="black",snakeColors=["blue","green","white","purple","yellow","pink","brown","orange"],foodColor="red",gameActive=!1,touchStartX=null,touchStartY=null,paintPlayer=function paintPlayer(e,t,n){ctx.fillStyle=n,e.lost||e.snake.forEach(function(e){ctx.fillRect(e.x*t,e.y*t,t,t)})},paintGame=function paintGame(e){ctx.fillStyle=bgColor,ctx.fillRect(0,0,canvas.width,canvas.height);var t=e.foods,n=e.gridSize,a=canvas.width/n;ctx.fillStyle=foodColor,t.forEach(function(e){return ctx.fillRect(e.x*a,e.y*a,a,a)}),e.players.map(function(e,t){return paintPlayer(e,a,snakeColors[t])})},handleSnakeLost=function handleSnakeLost(e){var t=e.snake,n=e.size;ctx.fillStyle=bgColor,t.forEach(function(e){ctx.fillRect(e.x*n,e.y*n,n,n)})},onKeyDown=function onKeyDown(e){socket.emit("keyDown",e.key)},changePlayersQty=function changePlayersQty(e){/^[2-8]$/.test(e.currentTarget.value)||(e.currentTarget.value=2),playersQtySpan.textContent=e.currentTarget.value},onTouchStart=function onTouchStart(e){var t=e.touches[0];touchStartX=t.clientX,touchStartY=t.clientY},onTouchMove=function onTouchMove(e){var t,n;touchStartX&&touchStartY&&(t=(n=e.touches[0]).clientX,n=n.clientY,t=t-touchStartX,n=n-touchStartY,socket.emit("keyDown",Math.abs(t)>Math.abs(n)?0<t?"ArrowRight":"ArrowLeft":0<n?"ArrowDown":"ArrowUp"),touchStartY=touchStartX=null)},handleGameState=function handleGameState(e){gameActive&&requestAnimationFrame(function(){return paintGame(e)})},createPlayAgainListItem=function createPlayAgainListItem(e){var t=document.createElement("li"),n=(t.className="list-group-item",document.createElement("i")),n=(n.className="fas fa-circle-notch fa-spin text-primary",n.id="icon-".concat(e),t.appendChild(n),document.createElement("span"));n.textContent=" - Player ".concat(e),t.appendChild(n),playAgainList.appendChild(t)},getElementComputedStyleDisplay=function getElementComputedStyleDisplay(e){return window.getComputedStyle(e).getPropertyValue("display")},toggleSettings=function toggleSettings(){var e=_slicedToArray("none"==getElementComputedStyleDisplay(settingsDiv)?["block","none"]:["none","block"],2),t=e[0],e=e[1];settingsDiv.style.display=t,gameEnterDiv.style.display=e},setSettingsFromCache=function setSettingsFromCache(){var e=localStorage.frameRate||4,e=(velocitySpan.textContent=e,velocityInput.value=e,localStorage.foodQty||1);foodQtySpan.textContent=e,foodQtyInput.value=e},changeVelocitySpanAndCache=function changeVelocitySpanAndCache(e){var t=e.currentTarget.value;velocitySpan.textContent=t,localStorage.frameRate=t},changeFoodQtySpanAndCache=function changeFoodQtySpanAndCache(e){var t=e.currentTarget.value;foodQtySpan.textContent=t,localStorage.foodQty=t},createPlayAgainButtons=function createPlayAgainButtons(){var e=document.createElement("button"),t=document.createElement("button");e.className="btn btn-success me-2",t.className="btn btn-danger",e.textContent="Yes",t.textContent="No",e.onclick=function(){return socket.emit("playAgain",playerNumber)},t.onclick=function(){return socket.emit("dontPlayAgain",playerNumber)},e.type=t.type="button",playAgainButtonsDiv.append(e,t)},handleGameOver=function handleGameOver(e){var t=e.winnerNumber,n=e.playersQty;if(gameActive){gameActive=!1,winnerTextH5.textContent="".concat(t==playerNumber?"You":"Player ".concat(t)," Win!");for(var a=1;a<=n;a++)createPlayAgainListItem(a);createPlayAgainButtons(),popupOuter.style.display="flex"}},handleGameCode=function handleGameCode(e){gameCodeSpan.innerText=e},init=function init(){initialScreen.style.display="none",gameScreen.style.display="block",canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),canvas.width=canvas.height=600,isMobile&&(canvas.style.width="100%",canvas.style.height="70%"),ctx.fillStyle=bgColor,ctx.fillRect(0,0,canvas.width,canvas.height),document.addEventListener("touchstart",onTouchStart),document.addEventListener("touchmove",onTouchMove),document.addEventListener("keydown",onKeyDown),gameActive=!0},newGame=function newGame(){socket.emit("newGame",{playersQty:playersQtyInput.valueAsNumber,frameRate:velocityInput.valueAsNumber,foodQty:foodQtyInput.valueAsNumber}),isMobile&&document.body.requestFullscreen(),init()},joinGame=function joinGame(){var e=gameCodeInput.value;socket.emit("joinGame",e),isMobile&&document.body.requestFullscreen(),init()},onGameCodeKeyDown=function onGameCodeKeyDown(e){"Enter"==e.key&&joinGame()},removePlayAgainButtons=function removePlayAgainButtons(){for(;playAgainButtonsDiv.firstChild;)playAgainButtonsDiv.removeChild(playAgainButtonsDiv.lastChild)},removePlayAgainListItems=function removePlayAgainListItems(){for(;playAgainList.firstChild;)playAgainList.removeChild(playAgainList.lastChild)},resetPopup=function resetPopup(){removePlayAgainButtons(),removePlayAgainListItems(),popupOuter.style.display="none",winnerTextH5.textContent=""},reset=function reset(){playerNumber=null,gameCodeInput.value="",gameCodeSpan.innerText="",initialScreen.style.display="block",gameScreen.style.display="none",resetPopup()},handleUnknownGame=function handleUnknownGame(){reset(),alert("Unknown game code")},handleTooManyPlayers=function handleTooManyPlayers(){reset(),alert("This game is already in progress")},handlePlayAgainMarked=function handlePlayAgainMarked(e){document.getElementById("icon-".concat(e)).className="fa fa-check text-success",playerNumber==e&&removePlayAgainButtons()},handleDontPlayAgainMarked=function handleDontPlayAgainMarked(e){document.getElementById("icon-".concat(e)).className="fa-solid fa-x text-danger",removePlayAgainButtons()},handleCounter=function handleCounter(e){playAgainButtonsDiv.textContent=e},handlePrepareToPlayAgain=function handlePrepareToPlayAgain(){resetPopup(),gameActive=!0,isMobile&&document.body.requestFullscreen()},handleInit=function handleInit(e){playerNumber=e,playerNumberH5.textContent="Player ".concat(playerNumber)};settingsButton.addEventListener("click",toggleSettings),playersQtyInput.addEventListener("change",changePlayersQty),velocityInput.addEventListener("input",changeVelocitySpanAndCache),foodQtyInput.addEventListener("input",changeFoodQtySpanAndCache),newGameButton.addEventListener("click",newGame),gameCodeInput.addEventListener("keydown",onGameCodeKeyDown),joinGameButton.addEventListener("click",joinGame),setSettingsFromCache(),socket.on("init",handleInit),socket.on("unknownGame",handleUnknownGame),socket.on("tooManyPlayers",handleTooManyPlayers),socket.on("gameCode",handleGameCode),socket.on("gameState",handleGameState),socket.on("gameOver",handleGameOver),socket.on("playAgainMarked",handlePlayAgainMarked),socket.on("dontPlayAgainMarked",handleDontPlayAgainMarked),socket.on("counter",handleCounter),socket.on("prepareToPlayAgain",handlePrepareToPlayAgain),socket.on("snakeLost",handleSnakeLost),socket.on("reset",reset);