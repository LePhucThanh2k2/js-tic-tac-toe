import { CELL_VALUE, TURN, GAME_STATUS } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCurrentTurnElement,
  getGameStatusElement,
  getReplayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";
/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let gameStatus = GAME_STATUS.PLAYING;
let cellValues = new Array(9).fill("");
function toggleTurn() {
  currentTurn = currentTurn === "circle" ? TURN.CROSS : TURN.CIRCLE;

  // update turn on DOM element
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
}
function hideReplayButton() {
  const buttonElement = getReplayButtonElement();
  buttonElement.classList.remove("show");
}
function updateGameStatus(status) {
  gameStatus = status;
  const currentStatus = getGameStatusElement();
  currentStatus.textContent = status;
}

function reset() {
  currentTurn = TURN.CROSS;
  cellValues = new Array(9).fill("");
  gameStatus = GAME_STATUS.PLAYING;
  updateGameStatus(GAME_STATUS.PLAYING);
  const currentTurnElement = getCurrentTurnElement();
  currentTurnElement.classList.remove(TURN.CROSS, TURN.CIRCLE);
  currentTurnElement.classList.add(currentTurn);
  hideReplayButton();
  const cellElementList = getCellElementList();
  for (const cell of cellElementList) {
    cell.className = "";
  }
}
function showReplayButton() {
  const buttonElement = getReplayButtonElement();
  buttonElement.classList.add("show");
  buttonElement.addEventListener("click", reset);
}
function highlightWinCells(PositionList) {
  for (const index of PositionList) {
    const cell = getCellElementAtIdx(index);
    cell.classList.add("win");
  }
}

function handleCellClick(cell, index) {
  // check game ended
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  // check cell isClicked
  const isClicked =
    cell.classList.contains(TURN.CROSS) || cell.classList.contains(TURN.CIRCLE);
  if (isClicked || isEndGame) return;
  // set selector cell
  cell.classList.add(currentTurn);

  //update cellValues
  cellValues[index] =
    currentTurn === "circle" ? CELL_VALUE.CIRCLE : CELL_VALUE.CROSS;

  //toggle turn
  toggleTurn();

  const game = checkGameStatus(cellValues);
  switch (game.status) {
    case GAME_STATUS.ENDED: {
      updateGameStatus(game.status);
      showReplayButton();
      break;
    }
    case GAME_STATUS.X_WIN:
    case GAME_STATUS.O_WIN: {
      updateGameStatus(game.status);
      showReplayButton();
      highlightWinCells(game.winPositions);
      break;
    }

    default:
    // playing
  }
}
function initCellElementList() {
  const cellElementList = getCellElementList();
  cellElementList.forEach((cell, index) => {
    cell.addEventListener("click", () => handleCellClick(cell, index));
  });
}
(() => {
  // bind click event for all cells
  initCellElementList();
  // bind click event for button replay
})();
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */
