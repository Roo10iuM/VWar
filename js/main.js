window.onload = function() {
    squares = document.getElementsByClassName("square");
    for(let i = 0; i < squares.length; i++) {
        squares[i].onclick= putX;        
        //Строка и столбец квадратика
        squares[i].row = Math.floor(i / 10);
        squares[i].column = i % 10;
        //возвращает соседние с квадартиком квадратики
        squares[i].findNeighbors = findNeighbors;
        //проверяет, можно ли убрать крестик (является ли он мостом в графе)
        squares[i].isBridge = isBridge;
        }
    //стартовые клетки
    squares[88].className += " red-x"
    squares[99].className += " blue-x"
    //Подсветка краев поля для обозначения очередности
    let field = document.getElementsByClassName("field")[0]
    field.style.borderColor = (turn % 2)? "blue" : "red";

    
    document.getElementById("make-move").onclick = function() {
        if(newX.length != 3) {
            window.alert("Необходимо выбрать 3 клетки для хода");
            return;
        }

        turn ++;
        //Подсветка краев поля для обозначения очередности
        field.style.borderColor = (turn % 2)? "blue" : "red";

        //Оставил массив новых крестиков 
        newX = [];
        //способ с циклом
        // for(let i = 0; i < squares.length; i++) {
        //     squares[i].new = false;
        // }

        //Для проверки окончания игры можно пробегать по всем квадартикам
        //и для каждого свободного или вражеского (их можем съесть) проверять isAlive
        var endOfGame = true;
        for(let i = 0; i < squares.length; i ++) {
            if(((squares[i].className == "square") || (squares[i].className == ("square " + ((turn % 2) ? "red": "blue") + "-x"))) 
                && isAlive(squares[i])) {
                endOfGame = false;
                break;
            }
        }
        if(endOfGame){
            window.alert("Игра окончена! Победил " + ((turn%2) ? "красный": "синий") + " игрок");
        }
    }        
}

function findNeighbors() {
    // или бахнуть метод каждому this
    //1 2 3 - номера соседей
    //4   6
    //7 8 9
    let neighbors = []
    if(this.row != 0) { 
        //сосед 2
        neighbors.push(squares[(this.row - 1) * 10 + this.column])
        if(this.column != 0) {
            //сосед 1
            neighbors.push(squares[(this.row - 1) * 10 + this.column - 1])            
        }
        if(this.column != 9) {
            //сосед 3
            neighbors.push(squares[(this.row - 1) * 10 + this.column + 1])            
        }
    }
    if(this.row != 9) { 
        //сосед 8
        neighbors.push(squares[(this.row + 1) * 10 + this.column])
        if(this.column != 0) {
            //сосед 7
            neighbors.push(squares[(this.row + 1) * 10 + this.column - 1])            
        }
        if(this.column != 9) {
            //сосед 9
            neighbors.push(squares[(this.row + 1) * 10 + this.column + 1])            
        }
    }
    if(this.column != 0) {
        //сосед 4
        neighbors.push(squares[this.row * 10 + this.column - 1])
    }
    if(this.column != 9) {
        //сосед 6
        neighbors.push(squares[this.row * 10 + this.column + 1])
    }
    return neighbors;
}

function isAlive(square, delete_check) { //можем ди поставить крестик в данную клетку?
    //delete_check - костыль, нужен для isBridge
    let myColor = (turn % 2) ? "blue" : "red";
    let enemyColor = (turn % 2) ? "red" : "blue";
    let neighbors = square.findNeighbors(); //список соседей, ищем среди них живую клетку
                                            //если находим мертвую клетку нашего цвета, то добавляем ее соседей в список
    let newNeighbors;                   //соседи соседей при поиске в глубину

    for(let i = 0; i < neighbors.length; i ++) { 
        if((neighbors[i].className == "square " + enemyColor + "-x " + myColor + "-background")
            //мертвая клетка нашего цвета
            || (delete_check && newX.includes(neighbors[i]) && (neighbors[i].className == "square " + myColor + "-x"))){
                //живая клетка, но новая, поэтому при проверке isBridge не учитывается как живая, больше похожа на мертвую нашего цвета
                //Эта часть кода не нравится мне особенно. Можно вынести ее в отдельный if или переделать логику
            newNeighbors = neighbors[i].findNeighbors();
            //добавляем соседей без повторений
            for(let j = 0; j < newNeighbors.length; j ++) {
                if(!neighbors.includes(newNeighbors[j])) neighbors.push(newNeighbors[j]);
            } 
        }
        //нашли живую клетку
        else if(neighbors[i].className == "square " + myColor + "-x") return true;
    }   
    return false;
}

function putX() {
     // Ход синего
    if(turn % 2) {
        if(this.className == "square") {
            //клетка жива и поставили меньше 3 крестиков
            if(isAlive(this) && newX.length < 3) {
                this.className += " blue-x";
                //this.new = true;
                newX.push(this);
            }        
        }

        else if(this.className == "square red-x") {
            if(isAlive(this) && newX.length < 3) {
            this.className += " blue-background";
            //this.new = true;
            newX.push(this);
            }
        }
        //Отменить ход
        else if(this.className == "square blue-x" && newX.includes(this)) {
            //Проверка бага, что можно убирать крестики, которые является мостом
            if(!this.isBridge()) {
                this.className = "square";
                //this.new = false;
                newX.splice(newX.indexOf(this), 1);
            } 
        }

        else if(this.className == "square red-x blue-background" && newX.includes(this)) {
            if(!this.isBridge()) {
                this.className = "square red-x";
                //this.new = false;
                newX.splice(newX.indexOf(this), 1);
            }
        }
    }

     // Ход красного
    else {
        if(this.className == "square") {
            if(isAlive(this) && newX.length < 3) {
                this.className += " red-x";
                //this.new = true;
                newX.push(this);
            }
        }

        else if(this.className == "square blue-x") {
            if(isAlive(this) && newX.length < 3) {
                    this.className += " red-background";
                    //this.new = true;
                    newX.push(this);
                }
            }
        
        //Отменить ход
        else if(this.className == "square red-x"&& newX.includes(this)) {
            if(!this.isBridge()) {
                this.className = "square";
                //this.new = false
                newX.splice(newX.indexOf(this), 1);
                }
            }

        else if(this.className == "square blue-x red-background" && newX.includes(this)) {
            if(!this.isBridge()) {
                    this.className = "square blue-x";
                    //this.new = false;
                    newX.splice(newX.indexOf(this), 1);
                }         
            }
        }
    }

function isBridge() { //Можем ли удалить крестик (Является ли он мостом?)
    let neighbors = this.findNeighbors();
    //Временно затираем крестик
    let cN = this.className;
    this.className = "square";
    //Проверяем, все ли новые крестики остались живы
    //то есть располагаются ли крестики, поставленные на этом ходу, в дозволеных местах
    for(let i = 0; i < neighbors.length; i ++) {
        if(newX.includes(neighbors[i]) && !isAlive(neighbors[i], true)) {
            //Если кто-то умер, то это мост, возвращаем как было
            this.className = cN;
            return true;
        }   
    } 
    //Если нет, значит не мост
    this.className = cN;
    return false;
}
//не помнню, почему эти переменные определяются здесь
//возможно, из-за области видимости, на var-у все равно
var turn = 0;
var newX = [];