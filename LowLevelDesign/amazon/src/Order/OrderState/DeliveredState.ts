import { Order } from "../Order";

export class DeliveredState {
    shipOrder(order: Order): void {
        throw new Error('Order is already delivered. Cannot ship again.');
    }

    deliverOrder(order: Order): void {
        throw new Error('Order is already delivered.');
    }

    cancelOrder(order: Order): void {
        throw new Error('Delivered order cannot be canceled.');
    }
}   