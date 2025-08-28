import { Cell } from "./Cell";
import { Symbol } from "./enum/Symbol";

export class Board {
    public board: Cell[][];
    constructor(public size: number) {
        this.size = size;
        this.board = [];
        for (let i = 0; i < size; i++) {
            const row = [];
            for (let j = 0; j < size; j++) {
                row.push(new Cell(i, j));
            }
            this.board.push(row);
        }
    }

    public updateBoardCell(row: number, col: number, symbol: Symbol): void {
        // Assuming you have a 2D array called 'cells'
        this.board[row][col].updateCell(symbol);
    }

    public isFull(): boolean {
        for (let i = 0; i < this.size; i++) {   
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j].getSymbol() === Symbol.EMPTY) {
                    return false;
                }
            }
        }
        return true;
    }

    public printBoard(): void {
        console.log("------------------------")
        for(let i=0; i < this.size; i++) {
            let rowStr = "";
            for(let j=0; j < this.size; j++) {
                rowStr += this.board[i][j].getSymbol() + (j < this.size - 1 ? " | " : "");
            }
            console.log(rowStr);
            if (i < this.size - 1) {
                console.log("-".repeat(rowStr.length));
            }
        }
        console.log("------------------------")
    }
}