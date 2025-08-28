import { Order } from "../../Order";
import { OrderObserverInterface } from "../Observer/OrderObserverInterface";

export class OrderSubject {
    private observers: OrderObserverInterface[] = [];

    addObserver(observer: OrderObserverInterface): void {
        this.observers.push(observer);
    }

    removeObserver(observer: OrderObserverInterface): void {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(order: Order): void {
        for (const observer of this.observers) {
            observer.update(order);
        }
    }
}