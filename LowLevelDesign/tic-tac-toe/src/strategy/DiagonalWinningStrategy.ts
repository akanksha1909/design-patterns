import { Board } from "../Board";
import { Player } from "../Player";
import { WinningStrategy } from "./WinningStrategy";

export class DiagonalWinningStrategy  implements WinningStrategy {
    checkWinner(board: Board, player: Player): boolean {
        for(let i = 0; i < board.size; i++) {
            if(board.board[i][i].getSymbol() !== player.symbol) {
                return false;
            }
        }
        return true;
    }
}