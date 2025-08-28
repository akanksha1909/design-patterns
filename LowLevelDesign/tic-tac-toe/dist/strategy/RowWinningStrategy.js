"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RowWinningStrategy = void 0;
class RowWinningStrategy {
    checkWinner(board, player) {
        for (let row = 0; row < board.size; row++) {
            let rowWin = true;
            for (let col = 0; col < board.size; col++) {
                if (board.board[row][col].getSymbol() !== player.symbol) {
                    rowWin = false;
                    break;
                }
            }
            if (rowWin)
                return true;
        }
        return false;
    }
}
exports.RowWinningStrategy = RowWinningStrategy;
