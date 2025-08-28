enum Symbol {
    X = 'X',
    O = 'O',
    EMPTY = 'E' 
}

export class Player {
    constructor(public name: string, public symbol: Symbol) {
        this.symbol = symbol
    }
}