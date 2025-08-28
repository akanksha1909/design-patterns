import { Order, OrderStatus } from "../Order";
import { OrderState } from "./OrderState";

export class ShippedState implements OrderState {
    shipOrder(): void {
        throw new Error("Order is already shipped.");
    }
    
    deliverOrder(order: Order): void {
        console.log("Delivering order...");
        order.setStatus(OrderStatus.DELIVERED);
    }

    cancelOrder(): void {
        throw new Error("Cannot cancel a shipped order.");
    }
}