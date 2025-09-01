import { Board } from "../Board";
import { Player } from "../Player";
import { WinningStrategy } from "./WinningStrategy";

export class RowWinningStrategy  implements WinningStrategy {
    checkWinner(board: Board, player: Player): boolean {
        for(let row = 0; row < board.size; row++) {
            let rowWin = true;
            for(let col = 0; col < board.size; col++) {
                if(board.board[row][col].getSymbol() !== player.symbol) {
                    rowWin = false;
                    break;
                }
            }
            if(rowWin) return true;
        }
        return false
    }
}