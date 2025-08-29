import { Game } from "../Game";
import { GameObserver } from "./GameObserver";

export class GameSubject {
    private observers: GameObserver[] = [];

    public registerObserver(observer: GameObserver): void {
        this.observers.push(observer);
    }

    public unregisterObserver(observer: GameObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    public notifyObservers(): void {
        for (const observer of this.observers) {
            // Todo: Revisit this
            observer.update(this as unknown as Game)
        }
    }
}