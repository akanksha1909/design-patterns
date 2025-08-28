import { Board } from "../Board";
import { Player } from "../Player";

export interface WinningStrategy {
    checkWinner(board: Board, player: Player): boolean
}