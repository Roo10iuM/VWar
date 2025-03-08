let newX = [];

window.onload = function () {
    let turn = 0;
    
    const squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++) {
        let row = Math.floor(i / 10);
        let column = i % 10;
        squares[i].onclick = putX;
        squares[i].row = row;
        squares[i].column = column;
        squares[i].neighbors = findNeighbors(row, column, squares);
        squares[i].isBridge = isBridge;
    }

    //стартовые клетки
    squares[0].className += " red-x";
    squares[99].className += " blue-x";

    //Подсветка краев поля для обозначения очередности
    let field = document.getElementsByClassName("field")[0];
    field.style.borderColor = "red";

    document.getElementById("make-move").onclick = function () {
        if (newX.length != 3) {
            window.alert("Необходимо выбрать 3 клетки для хода");
            return;
        }

        turn++;
        let turnColor = (turn % 2) ? "blue" : "red";
        field.style.borderColor = turnColor;
        newX = [];

        //Проверка окончания игры 
        let endOfGame = true;
        for (const sqr of squares) {
            if ((sqr.className == `square ${turnColor}-x` 
            ||  sqr.className == "square")
            &&  isAlive(sqr, turn)) {    
                endOfGame = false;
                break;
            }
        }
        if (endOfGame) {
            let winpl = (turn % 2) ? "красный" : "синий";
            window.alert(`Игра окончена! Победил ${winpl} игрок`);
        }
    }

    function putX() {
        // Ход синего
        let myColor = (turn % 2) ? "blue" : "red";
        let enColor = (turn % 2) ? "red" : "blue";

        if (this.className == "square") {
            //клетка жива и поставили меньше 3 крестиков
            if (isAlive(this, turn) && newX.length < 3) {
                this.className += ` ${myColor}-x`;
                newX.push(this);
            }
        }
        else if (this.className == `square ${enColor}-x`) {
            if (isAlive(this, turn) && newX.length < 3) {
                this.className += ` ${myColor}-background`;
                newX.push(this);
            }
        }
        else if (this.className == `square ${myColor}-x` && newX.includes(this)) {
            if (!this.isBridge()) {
                this.className = "square";
                newX.splice(newX.indexOf(this), 1);
            }
        }
        else if (this.className == `square ${enColor}-x ${myColor}-background`
            && newX.includes(this)) {
            if (!this.isBridge()) {
                this.className = `square ${enColor}-x`;
                newX.splice(newX.indexOf(this), 1);
            }
        }
    }
}
//1 2 3 
//4 * 6 - номера соседей
//7 8 9
function findNeighbors(row, column, squares) {
    let neighbors = [];
    if (row != 0) {
        //сосед 2
        neighbors.push(squares[(row - 1) * 10 + column]);
        //сосед 1
        if (column != 0) {
            neighbors.push(squares[(row - 1) * 10 + column - 1]);
        }
        //сосед 3
        if (column != 9) {
            neighbors.push(squares[(row - 1) * 10 + column + 1]);
        }
    }
    if (row != 9) {
        //сосед 8
        neighbors.push(squares[(row + 1) * 10 + column]);
        //сосед 7
        if (column != 0) {
            neighbors.push(squares[(row + 1) * 10 + column - 1]);
        }
        //сосед 9
        if (column != 9) {
            neighbors.push(squares[(row + 1) * 10 + column + 1]);
        }
    }
    //сосед 4
    if (column != 0) {
        neighbors.push(squares[row * 10 + column - 1]);
    }
    //сосед 6
    if (column != 9) {
        neighbors.push(squares[row * 10 + column + 1]);
    }
    return neighbors;
}

//можем ди поставить крестик в данную клетку?
function isAlive(square, turn, ignoreNewX) {
    const myColor = (turn % 2) ? "blue" : "red";
    const enemyColor = (turn % 2) ? "red" : "blue";

    let neighbors = square.neighbors;
    let newNeighbors;

    const deadsqr = `square ${enemyColor}-x ${myColor}-background`;
    const myX = `square ${myColor}-x`;
    for (const nghb of neighbors) {
        if (nghb.className == deadsqr 
        ||  nghb.className == myX
        &&  newX.includes(nghb)
        &&  ignoreNewX) {
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

//Можем ли удалить крестик (Является ли он мостом?)
function isBridge(turn) {
    const cN = this.className;
    this.className = "square";

    //Проверяем, все ли новые крестики остались живы
    for (const x of newX) {
        if (!isAlive(x, turn, true)) {
            this.className = cN;
            return true;
        }
    }

    this.className = cN;
    return false;
}