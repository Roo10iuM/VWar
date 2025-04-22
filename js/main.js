import { paintFieldBorder } from "./cosmetic.js";
import { initSquares, nextTurn, createGameState } from "./gameLogic/index.js";

window.onload = function () {
    const gameState = createGameState("red");
    initSquares(gameState);

    const field = document.getElementsByClassName("field")[0];
    field.squares = document.getElementsByClassName("square");
    
    paintFieldBorder(gameState.getFirstPl(), field);
    initTurnButton(nextTurn, gameState, field);
}

function initTurnButton(nextTurn, gameState, field) {
    const turnButton = document.getElementById("make-move");
    turnButton.onclick = () => nextTurn(gameState, field);
}