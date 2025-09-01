import { Board } from "../Board";
import { Player } from "../Player";
import { WinningStrategy } from "./WinningStrategy";

export class ColWinningStrategy  implements WinningStrategy {
    checkWinner(board: Board, player: Player): boolean {
        for(let col = 0; col < board.size; col++) {
            let colWin = true;
            for(let row = 0; row < board.size; row++) {
                if(board.board[row][col].getSymbol() !== player.symbol) {
                    colWin = false;
                    break;
                }
            }
            if(colWin) return true;
        }
        return false
    }
}