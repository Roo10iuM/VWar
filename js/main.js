import { paintField } from "./cosmetic.js";
import { initSquares, nextTurn, createGameState } from "./gameLogic/index.js";

window.onload = function () {
    const gameState = createGameState("red");
    initSquares(gameState);
    paintField(gameState.getFirstPl());
    initTurnButton(() => nextTurn(gameState));
}

function initTurnButton(nextTurn) {
    const turnButton = document.getElementById("make-move");
    turnButton.onclick = nextTurn;
}