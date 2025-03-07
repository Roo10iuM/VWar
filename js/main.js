window.onload = function () {
    squares = document.getElementsByClassName("square");
    for (let i = 0; i < squares.length; i++) {
        squares[i].onclick = putX;
        squares[i].row = Math.floor(i / 10);
        squares[i].column = i % 10;
        squares[i].findNeighbors = findNeighbors;
        squares[i].isBridge = isBridge;
    }

    //стартовые клетки
    squares[0].className += " red-x";
    squares[99].className += " blue-x";

    //Подсветка краев поля для обозначения очередности
    let field = document.getElementsByClassName("field")[0];
    field.style.borderColor = (turn % 2) ? "blue" : "red";

    document.getElementById("make-move").onclick = function () {
        if (newX.length != 3) {
            window.alert("Необходимо выбрать 3 клетки для хода");
            return;
        }

        turn++;
        let turnColor = (turn % 2) ? "red" : "blue";
        field.style.borderColor = turnColor;
        newX = [];

        //Проверка окончания игры 
        var endOfGame = true;
        for (sqr of squares) {
            if ((sqr.className == `square ${turnColor}-x` 
            ||  sqr.className == "square")
            &&  isAlive(sqr)) {    
                endOfGame = false;
                break;
            }
        }
        if (endOfGame) {
            let winpl = (turn % 2) ? "красный" : "синий";
            window.alert(`Игра окончена! Победил ${winpl} игрок`);
        }
    }
}

function putX() {
    // Ход синего
    let myColor = (turn % 2) ? "blue" : "red";
    let enColor = (turn % 2) ? "red" : "blue";

    if (this.className == "square") {
        //клетка жива и поставили меньше 3 крестиков
        if (isAlive(this) && newX.length < 3) {
            this.className += ` ${myColor}-x`;
            newX.push(this);
        }
    }
    else if (this.className == `square ${myColor}-x`) {
        if (isAlive(this) && newX.length < 3) {
            this.className += ` ${enColor}-background`;
            newX.push(this);
        }
    }
    else if (this.className == `square ${myColor}-x` && newX.includes(this)) {
        if (!this.isBridge()) {
            this.className = "square";
            newX.splice(newX.indexOf(this), 1);
        }
    }
    else if (this.className == `square ${enColor}-x ${myColor}-background` && newX.includes(this)) {
        if (!this.isBridge()) {
            this.className = `square ${enColor}-x`;
            newX.splice(newX.indexOf(this), 1);
        }
    }
}

//1 2 3 
//4 * 6 - номера соседей
//7 8 9
function findNeighbors() {
    let neighbors = [];
    if (this.row != 0) {
        //сосед 2
        neighbors.push(squares[(this.row - 1) * 10 + this.column]);
        //сосед 1
        if (this.column != 0) {
            neighbors.push(squares[(this.row - 1) * 10 + this.column - 1]);
        }
        //сосед 3
        if (this.column != 9) {
            neighbors.push(squares[(this.row - 1) * 10 + this.column + 1]);
        }
    }
    if (this.row != 9) {
        //сосед 8
        neighbors.push(squares[(this.row + 1) * 10 + this.column]);
        //сосед 7
        if (this.column != 0) {
            neighbors.push(squares[(this.row + 1) * 10 + this.column - 1]);
        }
        //сосед 9
        if (this.column != 9) {
            neighbors.push(squares[(this.row + 1) * 10 + this.column + 1]);
        }
    }
    //сосед 4
    if (this.column != 0) {
        neighbors.push(squares[this.row * 10 + this.column - 1]);
    }
    //сосед 6
    if (this.column != 9) {
        neighbors.push(squares[this.row * 10 + this.column + 1]);
    }
    return neighbors;
}

//можем ди поставить крестик в данную клетку?
function isAlive(square, new_ignore) {
    let myColor = (turn % 2) ? "blue" : "red";
    let enemyColor = (turn % 2) ? "red" : "blue";

    let neighbors = square.findNeighbors();
    let newNeighbors;

    let deadsqr = `square ${enemyColor}-x ${myColor}-background`;
    let redX = `square ${myColor}-x`;
    for (nghb of neighbors) {
        if (nghb.className == deadsqr 
        ||  nghb.className == redX
        &&  newX.includes(nghb)
        &&  new_ignore) {
            newNeighbors = nghb.findNeighbors();
            for (newNghb of newNeighbors) {
                if (!neighbors.includes(newNghb)) {
                    neighbors.push(newNghb);
                }
            }
        }
        else if (nghb.className == redX) {
            return true;
        }
    }
    return false;
}

//Можем ли удалить крестик (Является ли он мостом?)
function isBridge() {
    let cN = this.className;
    this.className = "square";

    //Проверяем, все ли новые крестики остались живы
    for (x of newX) {
        if (!isAlive(x, true)) {
            this.className = cN;
            return true;
        }
    }

    this.className = cN;
    return false;
}

//не помнню, почему эти переменные определяются здесь
//возможно, из-за области видимости, на var-у все равно
var turn = 0;
var newX = [];