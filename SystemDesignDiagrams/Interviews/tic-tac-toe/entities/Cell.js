export class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.symbol = null; // X, O
    }

    updateCell(symbol) {
        this.symbol = symbol;
    }

    getSymbol() {
        return this.symbol;
    }
}