"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = void 0;
const Game_1 = require("./Game");
class TicTacToe {
    constructor() {
        // Private constructor to prevent instantiation
    }
    static getInstance() {
        if (!TicTacToe.instance) {
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }
    createGame(player1, player2) {
        this.game = new Game_1.Game(player1, player2);
    }
    printBoard() {
        this.game.board.printBoard();
    }
    makeMove(row, col, player) {
        this.game.makeMove(row, col, player);
    }
}
exports.TicTacToe = TicTacToe;
