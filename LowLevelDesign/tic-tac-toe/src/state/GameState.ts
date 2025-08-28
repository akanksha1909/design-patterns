import { Game } from "../Game";
import { Player } from "../Player";

export interface GameState {
    handleMove(game: Game, player: Player, row: number, col: number): void;  
}