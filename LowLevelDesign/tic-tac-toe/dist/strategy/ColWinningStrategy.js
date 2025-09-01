"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColWinningStrategy = void 0;
class ColWinningStrategy {
    checkWinner(board, player) {
        for (let col = 0; col < board.size; col++) {
            let colWin = true;
            for (let row = 0; row < board.size; row++) {
                if (board.board[row][col].getSymbol() !== player.symbol) {
                    colWin = false;
                    break;
                }
            }
            if (colWin)
                return true;
        }
        return false;
    }
}
exports.ColWinningStrategy = ColWinningStrategy;
