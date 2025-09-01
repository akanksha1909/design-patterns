import { Game } from "./Game";
import { GameObserver } from "./observer/GameObserver";

export class Scoreboard implements GameObserver {
    private scores: Map<string, number>;

    constructor() {
        this.scores = new Map<string, number>();
    }

    public update(game: Game): void {
        const winner = game.getWinner();
        if (winner) {
            const currentScore = this.scores.get(winner.name) || 0;
            this.scores.set(winner.name, currentScore + 1);
            console.log(`Scoreboard Updated: ${winner.name} has ${this.scores.get(winner.name)} wins.`);
        } else {
            console.log("No winner yet, scoreboard remains unchanged.");
        }
    }

}