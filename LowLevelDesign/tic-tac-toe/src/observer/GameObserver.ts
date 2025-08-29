import { Game } from "../Game";

export interface GameObserver {
    update(game: Game): void; 
}