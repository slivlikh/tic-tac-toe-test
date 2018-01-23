class TicTacToe {
    constructor (player1, player2){
        this.createPlayers();

        this.isEndGame = false;
        this.stack = [];
        this.historyStack = [];
        this.playerToTurn = this.player1.firstTurn ? this.player1 : this.player2;

        this.$undoBtn = $(".undo-btn");
        this.$redoBtn = $(".redo-btn");

        this.eventListeners();
    }

    createPlayers(){
        this.player1 = new Player("Jeremy", "ch", "Crosses won!", true);
        this.player2 = new Player("James", "r", "Toes won!", false);
    }

    switchTurn (){
        this.playerToTurn = this.playerToTurn.className === this.player1.className ? this.player2 : this.player1;
    }

    makeTurn (id){
        this.historyStack = [];
        this.$redoBtn.prop("disabled", true);

        this.pushToHistory(id, this.playerToTurn.className);

        const isWinningTurn = this.isWinningTurn();

        if(!isWinningTurn){
            if(this.stack.length === ROWS_COUNT * COLS_COUNT){
                this.toDraw();
            }else{
                this.switchTurn();
            }
        }
    }

    isWinningTurn(){
        const winningComb = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for(let i = 0; winningComb.length > i; i++){
            const matchTerns = this.stack.filter((stackItem)=>{
                if(winningComb[i].indexOf(stackItem.id) !== -1){
                    return true;
                }
            });

            if(matchTerns.length === 3 && matchTerns[0].className === matchTerns[1].className && matchTerns[0].className === matchTerns[2].className){
                this.toWin(matchTerns[0].className, winningComb[i]);
                return true;
            }
        }

        return false;
    }

    toWin(className, cellsId){
        this.isEndGame = true;
        this.$undoBtn.prop("disabled", true);
        this.$redoBtn.prop("disabled", true);

        $(".won-title").removeClass("hidden");
        $(".won-message").text(this.player1.className === className ? this.player1.wonText : this.player2.wonText);

        const direction = this.getDirection(cellsId);

        $(".cell").each(function(index, el){
            const $el = $(el);

            if( cellsId.indexOf($el.data("id")) !== -1 ){
                $el.addClass("win").addClass(direction)
            }
        })

    }

    getDirection(cellsId){
        if(cellsId[0] + 1 === cellsId[1]){
            return "horizontal";
        }else if(cellsId[0] + ROWS_COUNT === cellsId[1]){
            return "vertical";
        }else if(cellsId[0] + ROWS_COUNT + 1 === cellsId[1]){
            return "diagonal-right";
        }else{
            return "diagonal-left";
        }
    }

    toDraw(){
        this.$undoBtn.prop("disabled", true);
        this.$redoBtn.prop("disabled", true);
        this.isEndGame = true;
        
        $(".won-title").removeClass("hidden");
        $(".won-message").text("It's a draw!");
    }

    undoTurn(){
        this.popFromHistory();
        this.switchTurn();
    }

    redoTurn(){
        if(this.historyStack.length > 0){
            const nextTurn = this.historyStack.pop();

            this.pushToHistory(nextTurn.id, nextTurn.className);
            this.switchTurn();
        }

        if(this.historyStack.length === 0){
            this.$redoBtn.prop("disabled", true);
        }
    }

    renderTurn(id, className, classAction){
        $(`.cell[data-id=${id}]`)[classAction](className);
    }

    pushToHistory(id, className){
        this.stack.push({id, className});

        this.$undoBtn.prop("disabled", false);
        this.renderTurn(id, className, "addClass");
    }

    popFromHistory(){
        if(this.stack.length > 0){
            const lastTurn = this.stack.pop();
            this.historyStack.push(lastTurn);

            this.renderTurn(lastTurn.id, lastTurn.className, "removeClass");

            this.$redoBtn.prop("disabled", false);
            if(this.stack.length === 0){
                this.$undoBtn.prop("disabled", true);
            }
        }
    }

    restart(){
        $(".cell").removeClass().addClass("cell");
        this.isEndGame = false;
        this.stack = [];
        this.historyStack = [];
        this.playerToTurn = this.player1.firstTurn ? this.player1 : this.player2;
        this.$undoBtn.prop("disabled", true);
        this.$redoBtn.prop("disabled", true);
        $(".won-title").addClass("hidden");
        $(".won-message").text("");
    }

    eventListeners(){
        $(".field").on("click", ".cell", (e)=>{
            const $curTarget = $(e.currentTarget);

            if(!$curTarget.hasClass(this.player1.className, this.player2.className) && !this.isEndGame){
                this.makeTurn($curTarget.data("id"));
            }
        });

        this.$undoBtn.click((e)=>{
            this.undoTurn();
        });

        this.$redoBtn.click((e)=>{
            this.redoTurn();
        });

        $(".restart-btn").click(()=>{
            this.restart()
        })
    }
}

class Player {
    constructor(name, className, wonText, firstTurn){
        this.name = name;
        this.className = className;
        this.firstTurn = firstTurn;
        this.wonText = wonText;
    }
}




const ticTacToe = new TicTacToe();



