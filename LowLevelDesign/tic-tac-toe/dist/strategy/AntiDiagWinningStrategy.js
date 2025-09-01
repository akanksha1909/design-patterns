"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AntiDiagWinningStrategy = void 0;
class AntiDiagWinningStrategy {
    checkWinner(board, player) {
        const size = board.size;
        let win = true;
        for (let i = 0; i < size; i++) {
            if (board.board[i][size - 1 - i].getSymbol() !== player.symbol) {
                win = false;
                break;
            }
        }
        return win;
    }
}
exports.AntiDiagWinningStrategy = AntiDiagWinningStrategy;
