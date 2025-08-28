import { Order, OrderStatus } from "../Order";
import { CancelledState } from "./CancelledState";
import { OrderState } from "./OrderState";
import { ShippedState } from "./ShippedState";

export class PlacedState implements OrderState {
    shipOrder(order: Order): void {
        console.log("Shipping order " + order.getId());
        order.setStatus(OrderStatus.SHIPPED);
        order.setState(new ShippedState());
    }

    deliverOrder(): void {
        throw new Error("Order cannot be delivered before shipping.");
    }
    
    cancelOrder(order: Order): void {
        console.log("Order canceled.");
        order.setStatus(OrderStatus.CANCELED);
        order.setState(new CancelledState())
    }
}