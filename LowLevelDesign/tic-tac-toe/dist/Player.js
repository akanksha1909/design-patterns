"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var Symbol;
(function (Symbol) {
    Symbol["X"] = "X";
    Symbol["O"] = "O";
    Symbol["EMPTY"] = "E";
})(Symbol || (Symbol = {}));
class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.symbol = symbol;
    }
}
exports.Player = Player;
