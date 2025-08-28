import { OrderObserverInterface } from "../Order/notify/Observer/OrderObserverInterface";
import { Order } from "../Order/Order";

export class User implements OrderObserverInterface {
    constructor(
        public id: string,
        public name: string,
        public email: string
    ) { }

    getId(): string { return this.id; } 
    update(order: Order) {
        console.log(`User ${this.name} notified about order ${order.id} status: ${order.status}`);
    }
}