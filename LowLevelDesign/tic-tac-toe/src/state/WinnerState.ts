import { Game } from "../Game";
import { Player } from "../Player";

export class WinnerState{
    constructor(){

    }

    handleMove(game: Game, player: Player, row: number, col: number): void {
        // No action needed as the game has already been won
        throw new Error(`Game already won by ${game.getWinner()?.name}. No more moves allowed.`);
    }
}