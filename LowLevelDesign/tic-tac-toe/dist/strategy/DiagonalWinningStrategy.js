"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagonalWinningStrategy = void 0;
class DiagonalWinningStrategy {
    checkWinner(board, player) {
        for (let i = 0; i < board.size; i++) {
            if (board.board[i][i].getSymbol() !== player.symbol) {
                return false;
            }
        }
        return true;
    }
}
exports.DiagonalWinningStrategy = DiagonalWinningStrategy;
