window.onload = function() {
    squares = document.getElementsByClassName("square");
    for(let i = 0; i < squares.length; i++) {
        squares[i].onclick= putX;
        }
    document.getElementById("make-move").onclick = function() {
        turn ++;

    //Либо можео создать массив и записывать новые ходы,
    //  тогда не нуженц цикл.
    // Плюс в том, что нам подобный массив понадобится, чтобы на сервер отправлять
    // Минусы в том, что ещё одна лобавльная переменная
        for(let i = 0; i < squares.length; i++) {
            squares[i].new = false;
        }
    }
    

        
}
function putX() {
     // Ход синего
    if(turn % 2) {
        if(this.className == "square") {
            this.className += " blue-x";
            this.new = true;
        }

        else if(this.className == "square red-x") {
            this.className += " blue-background";
            this.new = true;
        }
        //Отменить ход
        else if(this.className == "square blue-x" && this.new) {
            this.className = "square";
            this.new = false;
        }

        else if(this.className == "square red-x blue-background" && this.new) {
            this.className = "square red-x";
            this.new = false;
        }
    }

     // Ход красного
    else {
        if(this.className == "square") {
            this.className += " red-x";
            this.new = true;
        }

        else if(this.className == "square blue-x") {
                this.className += " red-background";
                this.new = true;
            }
        
        //Отменить ход
        else if(this.className == "square red-x"&& this.new) {
                this.className = "square";
                this.new = false
                }

        else if(this.className == "square blue-x red-background" && this.new) {
                    this.className = "square blue-x";
                    this.new = false;
                }         
            }
}
var turn = 0;