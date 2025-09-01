"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = void 0;
const Cell_1 = require("./Cell");
const Symbol_1 = require("./enum/Symbol");
class Board {
    constructor(size) {
        this.size = size;
        this.size = size;
        this.board = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(new Cell_1.Cell(i, j));
            }
            this.board.push(row);
        }
    }
    updateBoardCell(row, col, symbol) {
        // Assuming you have a 2D array called 'cells'
        this.board[row][col].updateCell(symbol);
    }
    isFull() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].getSymbol() === Symbol_1.Symbol.EMPTY) {
                    return false;
                }
            }
        }
        return true;
    }
    printBoard() {
        console.log("------------------------");
        for (let i = 0; i < this.size; i++) {
            let rowStr = "";
            for (let j = 0; j < this.size; j++) {
                rowStr += this.board[i][j].getSymbol() + (j < this.size - 1 ? " | " : "");
            }
            console.log(rowStr);
            if (i < this.size - 1) {
                console.log("-".repeat(rowStr.length));
            }
        }
        console.log("------------------------");
    }
}
exports.Board = Board;
