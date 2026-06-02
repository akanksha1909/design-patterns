import { Board } from './Board.js'

export class Game {
    constructor(playerX, playerO) {
        this.playerX = playerX
        this.playerO = playerO
        this.board = new Board(3);
        this.winner = null;
        this.gameState = 'INPROGRESS'; // DRAW | END
    }

    makeMove(row, col, player) {
        this.board.updateCell(row, col, player)
        if(this.rowCheckWinner(player) 
            || this.colCheckWinner(player)
            || this.diagonalCheckWinner(player)
            || this.antiDiagWinner(player)
        ) {
            this.winner = player;
            this.gameState = "END";
        } else {
            if(this.board.isFilled()) {
                console.log("Game is Draw!")
                this.gameState = "DRAW";
            }
        }
    }

    rowCheckWinner(player) {
        const currentBoard = this.board.getBoard()
        for (let i = 0; i < currentBoard.length; i++) {
            let isRowWin = true
            for (let j = 0; j < currentBoard.length; j++) {
                if(currentBoard[i][j].getSymbol() != player.getSymbol()) {
                    isRowWin = false
                }
            }
            if(isRowWin) {
                return true;
            }
        }
    }

    /*
        00, 10, 20
        01, 11, 21

    */

    colCheckWinner(player) {
        const currentBoard = this.board.getBoard()

        for (let c = 0; c < currentBoard.length; c++) {
            let colWin = true;
            for (let r = 0; r < currentBoard.length; r++) {
                if (currentBoard[r][c].getSymbol() != player.getSymbol()) {
                    colWin = false
                    break
                }
            }
            if (colWin) {
                console.log("Winner by col Strategy")
                return true;
            }
        }
    }

    diagonalCheckWinner(player) {
        const currentBoard = this.board.getBoard()
        for(let i = 0; i< currentBoard.length;i++) {
            if(currentBoard[i][i].getSymbol() != player.getSymbol()) {
                return false
            }
        }
        return true;
    }

    antiDiagWinner(player) {
        // 02, 11, 20
        const currentBoard = this.board.getBoard()
        for(let r = 0; r < currentBoard.length;r++) {
            let c = 3 - r - 1;
            if(currentBoard[r][c].getSymbol() != player.getSymbol()) {
                return false;
            }
        }
        return true;
    }

    printBoard() {
        this.board.printBoard()
    }

}

