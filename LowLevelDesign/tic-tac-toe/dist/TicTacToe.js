"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicTacToe = void 0;
const Game_1 = require("./Game");
const Scoreboard_1 = require("./Scoreboard");
class TicTacToe {
    constructor() {
        // Private constructor to prevent instantiation
        this.scoreboard = new Scoreboard_1.Scoreboard();
    }
    static getInstance() {
        if (!TicTacToe.instance) {
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }
    createGame(player1, player2) {
        this.game = new Game_1.Game(player1, player2);
        this.game.registerObserver(this.scoreboard);
    }
    printBoard() {
        this.game.board.printBoard();
    }
    makeMove(row, col, player) {
        this.game.makeMove(row, col, player);
    }
}
exports.TicTacToe = TicTacToe;
