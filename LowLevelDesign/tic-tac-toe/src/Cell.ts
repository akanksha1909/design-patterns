import { Symbol } from "./enum/Symbol";
export class Cell {
    private symbol: Symbol;  
    constructor(public row: number, public col: number) {
        this.row = row;
        this.col = col;
        this.symbol = Symbol.EMPTY;
    }

    public getSymbol(): Symbol {
        return this.symbol;
    }

    public updateCell(symbol: Symbol): void {
        if (this.symbol === Symbol.EMPTY) {
            this.symbol = symbol;
        } else {
            throw new Error("Cell is already occupied");
        }
    }
}