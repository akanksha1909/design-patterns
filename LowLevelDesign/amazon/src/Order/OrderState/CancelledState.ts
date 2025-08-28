import { OrderState } from "./OrderState";

export class CancelledState implements OrderState {
    shipOrder(): void {
        throw new Error("Cannot ship a cancelled order.");
    }
    deliverOrder(): void {
        throw new Error("Cannot deliver a cancelled order.");
    }
    cancelOrder(): void {
        console.log("Order is already cancelled.");
    }
}