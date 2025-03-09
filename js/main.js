import { createGameState } from "./gameLogic.js";
import { paintField } from "./cosmetic.js";

window.onload = function () {
    const gameState = createGameState("red");
    
    paintField(gameState.getFirstPl());
    initTurnButton(gameState.nextTurn);
}

function initTurnButton(nextTurn) {
    const turnButton = document.getElementById("make-move");
    turnButton.onclick = nextTurn;
}