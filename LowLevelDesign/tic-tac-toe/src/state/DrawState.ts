import { Game } from "../Game";
import { Player } from "../Player";

export class DrawState{
    constructor(){

    }
    
    handleMove(game: Game, player: Player, row: number, col: number): void {
        throw new Error("Game ended in a draw. No more moves allowed.");
    }
}