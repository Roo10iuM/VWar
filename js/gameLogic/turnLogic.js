import { paintField } from "../cosmetic.js";

export function nextTurn(gameState) {
    if (isValidTurn(gameState)) {
        gameState.incTurn();
        for (const x of gameState.getNewX()) {
            x.style.borderWidth = "1px";
        }
        gameState.resetNewX();
        paintField(fieldColor(gameState));
    }
}

function fieldColor(gameState) {
    return (gameState.getTurn() % 2) ? gameState.getSecondPl() : gameState.getFirstPl();
}

function isValidTurn(gameState) {
    let limitX = (gameState.getTurn() < 2) ? 2 : 3;
    if (gameState.getLenNewX() != limitX && isPutPossible()) {
        return false;
    }
    for (const x of gameState.getNewX()) {
        if (!isAlive(gameState, x)) {
            return false;
        }
    }
    return true;
}

function isAlive(gameState, square) {
    const turn = gameState.getTurn();
    const firstPl = gameState.getFirstPl();
    const secondPl = gameState.getSecondPl();
    const myColor = (turn % 2) ? secondPl : firstPl;
    const enemyColor = (turn % 2) ? firstPl : secondPl;

    let neighbors = square.neighbors;
    let newNeighbors = [];

    const deadsqr = `square ${enemyColor}-x ${myColor}-background`;
    const myX = `square ${myColor}-x`;
    for (const nghb of neighbors) {
        if (nghb.className == deadsqr
            || nghb.className == myX
            && gameState.includesNewX(nghb)) {
            newNeighbors = nghb.neighbors;
            for (const newNghb of newNeighbors) {
                if (!neighbors.includes(newNghb)) {
                    neighbors.push(newNghb);
                }
            }
        }
        else if (nghb.className == myX) {
            return true;
        }
    }
    return false;
}

function isPutPossible() {
    return true;
}