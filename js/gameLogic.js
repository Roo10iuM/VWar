import { paintField } from "./cosmetic.js";

export function createGameState(plColor) {
    const firstPl = plColor;
    const secondPL = (plColor == "red") ? "blue" : "red";
    let turn = 0;
    let newX = [];
    const squares = initSquare();

    const defBord = "1px";
    const boldBord = "5px";

    return {
        getTurn: () => turn,
        nextTurn: () => nextTurn(),
        getFirstPl: () => firstPl,
    }
    
    function nextTurn() {
        if (isValidTurn()) {
            ++turn;
            for (const x of newX)
            {
                x.style.borderWidth = defBord;
            }
            newX = [];
            paintField((turn % 2) ? secondPL : firstPl);
        }
    }

    function isValidTurn() {
        let limitX = (turn < 2) ? 2 : 3;
        if (newX.length != limitX && isPutPossible()) {
            return false;
        }
        for (const x of newX) {
            if (!isAlive(x)) {
                return false;
            }
        }
        return true;
    }

    function isAlive(square) {
        const myColor = (turn % 2) ? secondPL : firstPl;
        const enemyColor = (turn % 2) ? firstPl : secondPL;

        let neighbors = square.neighbors;
        let newNeighbors = [];

        const deadsqr = `square ${enemyColor}-x ${myColor}-background`;
        const myX = `square ${myColor}-x`;
        for (const nghb of neighbors) {
            if (nghb.className == deadsqr
                || nghb.className == myX
                && newX.includes(nghb)) {
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



    function initSquare() {
        const squares = document.getElementsByClassName("square");
        for (let i = 0; i < squares.length; i++) {
            squares[i].row = Math.floor(i / 10);
            squares[i].column = i % 10;
            squares[i].onclick = putX;
            squares[i].neighbors = findNeighbors(squares[i]);
        } 

        squares[0].className += " red-x";
        squares[99].className += " blue-x";

        return squares;

        //7 8 9 
        //4 * 6 - neighbors numbers
        //1 2 3
        function findNeighbors(square) {
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
    }

    function putX() {
        let myColor = (turn % 2) ? secondPL : firstPl;
        let enColor = (turn % 2) ? firstPl : secondPL;
        let limitX = (turn < 2) ? 2 : 3;

        if (this.className == "square") {
            if (newX.length < limitX) {
                this.className += ` ${myColor}-x`;
                this.style.borderWidth = boldBord;
                newX.push(this);
            }
        }
        else if (this.className == `square ${enColor}-x`) {
            if (newX.length < limitX) {
                this.className += ` ${myColor}-background`;
                this.style.borderWidth = boldBord;
                newX.push(this);
            }
        }
        else if (this.className == `square ${myColor}-x` 
            && newX.includes(this)) {
                this.className = "square";
                this.style.borderWidth = defBord;
                newX.splice(newX.indexOf(this), 1);
        }
        else if (this.className == `square ${enColor}-x ${myColor}-background`
            && newX.includes(this)) {
                this.className = `square ${enColor}-x`;
                this.style.borderWidth = defBord;
                newX.splice(newX.indexOf(this), 1);
        }
    }
}