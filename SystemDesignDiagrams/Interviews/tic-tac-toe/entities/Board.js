import { Cell } from './Cell.js'

export class Board {
    constructor(size) {
        this.size = size;
        this.board = []
        for (let i = 0; i < size; i++) {
            let rows = []
            for (let j = 0; j < size; j++) {
                rows.push(new Cell(i, j))
            }
            this.board.push(rows)
        }
    }


    updateCell(row, col, player) {
        console.log(player.getSymbol())
        this.board[row][col].updateCell(player.getSymbol())
    }

    getBoard() {
        return this.board;
    }

    printBoard() {
        for(let i = 0; i<this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                console.log(this.board[i][j])
            }
        }
    }

    isFilled() {
        let filled = true;
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (!this.board[i][j].getSymbol()) {
                    filled = false
                    break
                }
            }
            if (!filled) {
                break;
            }
        }
        return filled;
    }
}