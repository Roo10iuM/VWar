export function initSquares(gameState) {
    const squares = document.getElementsByClassName("square");
        for (let i = 0; i < squares.length; i++) {
            squares[i].row = Math.floor(i / 10);
            squares[i].column = i % 10;
            squares[i].onclick = createPutX(gameState);
            squares[i].neighbors = findNeighbors(squares[i], squares);
        } 

    squares[0].classList.add("red-x");
    squares[99].classList.add("blue-x");

    return squares;
}

//7 8 9 
//4 * 6 - neighbors numbers
//1 2 3
function findNeighbors(square, squares) {
    let neighbors = [];
    const row = square.row;
    const column = square.column;

    if (row != 9) {
        //neighbor 1
        if (column != 0) {
            neighbors.push(squares[(row + 1) * 10 + column - 1]);
        }
        //neighbor 2
        neighbors.push(squares[(row + 1) * 10 + column]);
        //neighbor 3
        if (column != 9) {
            neighbors.push(squares[(row + 1) * 10 + column + 1]);
        }
    }

    //neighbor 4
    if (column != 0) {
        neighbors.push(squares[row * 10 + column - 1]);
    }
    //neighbor 6
    if (column != 9) {
        neighbors.push(squares[row * 10 + column + 1]);
    }

    if (row != 0) {
        //neighbor 7
        if (column != 0) {
            neighbors.push(squares[(row - 1) * 10 + column - 1]);
        }
        //neighbor 8
        neighbors.push(squares[(row - 1) * 10 + column]);
        //neighbor 9
        if (column != 9) {
            neighbors.push(squares[(row - 1) * 10 + column + 1]);
        }
    }
    return neighbors;
}


function createPutX(gameState) {
    const firstPl = gameState.getFirstPl();
    const secondPl = gameState.getSecondPl();
    const defBord = "1px";
    const boldBord = "5px";
    
    function putX() {
        const turn = gameState.getTurn();
        const lenNewX = gameState.getLenNewX();
        let myColor = (turn % 2) ? secondPl : firstPl;
        let enColor = (turn % 2) ? firstPl : secondPl;
        let limitX = (turn < 2) ? 2 : 3;

        if (this.classList.length == 1) {
            if (lenNewX < limitX) {
                this.classList.add(`${myColor}-x`);
                this.style.borderWidth = boldBord;
                gameState.pushNewX(this);
            }
        }
        else if (this.classList.contains(`${enColor}-x`)) {
            if (lenNewX < limitX) {
                this.classList.remove(`${enColor}-x`); 
                this.classList.add(`${myColor}-background`);
                this.style.borderWidth = boldBord;
                gameState.pushNewX(this);
            }
        }
        else if (this.classList.contains(`${myColor}-x`)
            && gameState.includesNewX(this)) {
            this.classList.remove(`${myColor}-x`);
            this.style.borderWidth = defBord;
            gameState.spliceNewX(this);
        }
        else if (this.classList.contains(`${myColor}-background`)
            && gameState.includesNewX(this)) {
            this.classList.remove(`${myColor}-background`);
            this.classList.add(`${enColor}-x`);
            this.style.borderWidth = defBord;
            gameState.spliceNewX(this);
        }
    }
    return putX;
}