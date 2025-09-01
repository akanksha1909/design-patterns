"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cell = void 0;
const Symbol_1 = require("./enum/Symbol");
class Cell {
    constructor(row, col) {
        this.row = row;
        this.col = col;
        this.row = row;
        this.col = col;
        this.symbol = Symbol_1.Symbol.EMPTY;
    }
    getSymbol() {
        return this.symbol;
    }
    updateCell(symbol) {
        if (this.symbol === Symbol_1.Symbol.EMPTY) {
            this.symbol = symbol;
        }
        else {
            throw new Error("Cell is already occupied");
        }
    }
}
exports.Cell = Cell;
