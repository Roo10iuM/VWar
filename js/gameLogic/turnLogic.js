import { paintFieldBorder } from "../cosmetic.js";

export function nextTurn(gameState, field) {
    if (isValidTurn(gameState)) {
        gameState.incTurn();
        for (const x of gameState.getNewX()) {
            x.style.borderWidth = "1px";
        }
        gameState.resetNewX();
        if (isEndGame(gameState, field.squares)) {
            alert("YOU WIN");
        }
        paintFieldBorder(fieldColor(gameState), field);
    }
}

function fieldColor(gameState) {
    return (gameState.getTurn() % 2) ? gameState.getSecondPl() : gameState.getFirstPl();
}

function isValidTurn(gameState) {
    //On the first move each player puts 2 crosses
    let limitX = (gameState.getTurn() < 2) ? 2 : 3;
    if (gameState.getLenNewX() != limitX) { 
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

function isEndGame(gameState, squares) {
    let num_of_possible_movies = 0;
    for (const sqr of squares) {
        if (isPotential(gameState, sqr)) {
            num_of_possible_movies += 1;
        }
        if (num_of_possible_movies >= 3) {
            return false;
        }
    }
    return true;
}


function isPotential(gameState, square) {

    const turn = gameState.getTurn();
    const firstPl = gameState.getFirstPl();
    const secondPl = gameState.getSecondPl();
    const myColor = (turn % 2) ? secondPl : firstPl;
    const enemyColor = (turn % 2) ? firstPl: secondPl;

    const deadsqr = `${myColor}-background`;
    const myX = `${myColor}-x`;
    const enemyX = `${enemyColor}-x`;

    if (!(square.classList.length == 1 
        || square.classList.contains(enemyX))) {
        return false;
    }

    let neighbors = [...square.neighbors];
    let newNeighbors = [];
    
    
    for (const nghb of neighbors) {
        if (nghb.classList.contains(deadsqr)
        || (nghb.classList.length == 1)
        || nghb.classList.contains(enemyX)) {
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

