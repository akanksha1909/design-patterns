import { GameStatus } from "../enum/GameStatus";
import { Game } from "../Game";
import { Player } from "../Player";
import { WinnerState } from "./WinnerState";
import { Symbol } from "../enum/Symbol";

export class InProgressState {
    constructor() {

    }

    handleMove(game: Game, player: Player, row: number, col: number): void {
        game.board.updateBoardCell(row, col, game.currentPlayer.symbol);

        // Check for winner or draw
        if (game.checkWinner(player)) {
            game.setWinner(player)
            game.setStatus(player.symbol == Symbol.X ? GameStatus.WINNER_X : GameStatus.WINNER_O);
            game.setState(new WinnerState());
        } else if (game.board.isFull()) {
            // Transition to DrawState if implemented
            console.log("Game ended in a draw!");
            game.setStatus(GameStatus.DRAW);
        } else {
            // Switch to the other player
            game.switchPlayer();
        }

    }
}