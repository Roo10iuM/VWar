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
    squares[0].className += " red-x"
    squares[99].className += " blue-x"

    //Подсветка краев поля для обозначения очередности
    let field = document.getElementsByClassName("field")[0]
    field.style.borderColor = (turn % 2) ? "blue" : "red";


    document.getElementById("make-move").onclick = function () {
        if (newX.length != 3) {
            window.alert("Необходимо выбрать 3 клетки для хода");
            return;
        }

        turn++;
        let turnColor = ((turn % 2) ? "red" : "blue");
        field.style.borderColor = turnColor;
        newX = [];

        //Проверка окончания игры 
        var endOfGame = true;
        for(sqr of squares){
            if (
               (sqr.className == "square" || 
                sqr.className == `square ${turnColor}-x`) &&
                isAlive(sqr)
            ){
                endOfGame = false;
                break;
            }
        }
        if (endOfGame) {
            window.alert("Игра окончена! Победил " + ((turn % 2) ? "красный" : "синий") + " игрок");
        }
    }
}

function findNeighbors() {
    // или бахнуть метод каждому this
    //1 2 3 - номера соседей
    //4   6
    //7 8 9
    let neighbors = []
    if (this.row != 0) {
        //сосед 2
        neighbors.push(squares[(this.row - 1) * 10 + this.column])
        if (this.column != 0) {
            //сосед 1
            neighbors.push(squares[(this.row - 1) * 10 + this.column - 1])
        }
        if (this.column != 9) {
            //сосед 3
            neighbors.push(squares[(this.row - 1) * 10 + this.column + 1])
        }
    }
    if (this.row != 9) {
        //сосед 8
        neighbors.push(squares[(this.row + 1) * 10 + this.column])
        if (this.column != 0) {
            //сосед 7
            neighbors.push(squares[(this.row + 1) * 10 + this.column - 1])
        }
        if (this.column != 9) {
            //сосед 9
            neighbors.push(squares[(this.row + 1) * 10 + this.column + 1])
        }
    }
    if (this.column != 0) {
        //сосед 4
        neighbors.push(squares[this.row * 10 + this.column - 1])
    }
    if (this.column != 9) {
        //сосед 6
        neighbors.push(squares[this.row * 10 + this.column + 1])
    }
    return neighbors;
}

//можем ди поставить крестик в данную клетку?
function isAlive(square, new_ignore) {
    let myColor = (turn % 2) ? "blue" : "red";
    let enemyColor = (turn % 2) ? "red" : "blue";

    let neighbors = square.findNeighbors();
    let newNeighbors;

    let deadsqr = `square ${enemyColor}-x ${myColor}-background`
    let redX = `square ${myColor}-x`
    for (nghb of neighbors) {
        if (
            nghb.className == deadsqr ||
            nghb.className == redX &&
            newX.includes(nghb) &&
            new_ignore
        ) {
            newNeighbors = nghb.findNeighbors();
            for (newNghb of newNeighbors) {
                if (!neighbors.includes(newNghb))
                    neighbors.push(newNghb);
            }
        }
        else if (nghb.className == redX)
            return true;
    }
    return false;
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