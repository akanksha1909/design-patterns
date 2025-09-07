import { Url } from "../Url";
import { AnalyticsConsumer } from "./AnalyticsConsumer";

export class AnalyticsProducer {
    private observers: Set<AnalyticsConsumer>;

    constructor() {
        this.observers = new Set();
    }

    public registerObserver(observer: AnalyticsConsumer): void {
        this.observers.add(observer);
    }

    public unregisterObserver(observer: AnalyticsConsumer): void {
        this.observers.delete(observer);
    }

    public notifyObservers(url: Url): void {
        for (const observer of this.observers) {
            observer.onExpiry(url)
        }
    }
}