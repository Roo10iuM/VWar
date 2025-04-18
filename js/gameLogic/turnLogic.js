import { paintFieldBorder } from "../cosmetic.js";

export function nextTurn(gameState, field) {
    if (isValidTurn(gameState)) {
        gameState.incTurn();
        for (const x of gameState.getNewX()) {
            x.style.borderWidth = "1px";
        }
        gameState.resetNewX();
        paintFieldBorder(fieldColor(gameState), field);
    }
}

function fieldColor(gameState) {
    return (gameState.getTurn() % 2) ? gameState.getSecondPl() : gameState.getFirstPl();
}

function isValidTurn(gameState) {
    //On the first move each player puts 2 crosses
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

    let neighbors = [...square.neighbors];
    let newNeighbors = [];

    const deadsqr = `${myColor}-background`;
    const myX = `${myColor}-x`;
    for (const nghb of neighbors) {
        if (nghb.classList.contains(deadsqr)
        || (nghb.classList.contains(myX)
        && gameState.includesNewX(nghb))) {
            newNeighbors = nghb.neighbors;
            for (const newNghb of newNeighbors) {
                if (!neighbors.includes(newNghb)) {
                    neighbors.push(newNghb);
                }
            }
        }
        else if (nghb.classList.contains(myX)) {
            return true;
        }
    }
    return false;
}

function isPutPossible() {
    return true;
}