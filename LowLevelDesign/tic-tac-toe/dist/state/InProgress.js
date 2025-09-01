"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InProgressState = void 0;
const GameStatus_1 = require("../enum/GameStatus");
const WinnerState_1 = require("./WinnerState");
const Symbol_1 = require("../enum/Symbol");
class InProgressState {
    constructor() {
    }
    handleMove(game, player, row, col) {
        game.board.updateBoardCell(row, col, game.currentPlayer.symbol);
        // Check for winner or draw
        if (game.checkWinner(player)) {
            game.setWinner(player);
            game.setStatus(player.symbol == Symbol_1.Symbol.X ? GameStatus_1.GameStatus.WINNER_X : GameStatus_1.GameStatus.WINNER_O);
            game.setState(new WinnerState_1.WinnerState());
        }
        else if (game.board.isFull()) {
            // Transition to DrawState if implemented
            console.log("Game ended in a draw!");
            game.setStatus(GameStatus_1.GameStatus.DRAW);
        }
        else {
            // Switch to the other player
            game.switchPlayer();
        }
    }
}
exports.InProgressState = InProgressState;
