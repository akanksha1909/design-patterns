import { Order } from "../Order";

export interface OrderState {
    shipOrder(order: Order): void;
    deliverOrder(order: Order): void; 
    cancelOrder(order: Order): void;
}