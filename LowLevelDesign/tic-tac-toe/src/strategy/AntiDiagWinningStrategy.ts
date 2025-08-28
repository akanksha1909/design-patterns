import { Board } from "../Board";
import { Player } from "../Player";
import { WinningStrategy } from "./WinningStrategy";

export class AntiDiagWinningStrategy  implements WinningStrategy {
    checkWinner(board: Board, player: Player): boolean {
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