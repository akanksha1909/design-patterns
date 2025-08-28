"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const Board_1 = require("./Board");
const GameStatus_1 = require("./enum/GameStatus");
const InProgress_1 = require("./state/InProgress");
const AntiDiagWinningStrategy_1 = require("./strategy/AntiDiagWinningStrategy");
const ColWinningStrategy_1 = require("./strategy/ColWinningStrategy");
const DiagonalWinningStrategy_1 = require("./strategy/DiagonalWinningStrategy");
const RowWinningStrategy_1 = require("./strategy/RowWinningStrategy");
class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Board_1.Board(3);
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1; // Player 1 starts first
        this.status = GameStatus_1.GameStatus.INPROGRESS;
        this.state = new InProgress_1.InProgressState();
        this.winningStrategies = [
            new RowWinningStrategy_1.RowWinningStrategy(),
            new ColWinningStrategy_1.ColWinningStrategy(),
            new DiagonalWinningStrategy_1.DiagonalWinningStrategy(),
            new AntiDiagWinningStrategy_1.AntiDiagWinningStrategy()
        ];
    }
    setWinner(player) {
        this.winner = player;
    }
    getWinner() {
        return this.winner;
    }
    setStatus(status) {
        this.status = status;
    }
    setState(state) {
        this.state = state;
    }
    makeMove(row, col, player) {
        this.state.handleMove(this, player, row, col);
    }
    checkWinner(player) {
        for (const strategy of this.winningStrategies) {
            if (strategy.checkWinner(this.board, player)) {
                console.log(`Player ${player.name} has won the game!`);
                console.log(`Winning strategy: ${strategy.constructor.name}`);
                return true;
            }
        }
        return false;
    }
    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }
}
exports.Game = Game;
