import { Order } from "../../Order";

export interface OrderObserverInterface {
    update(order: Order): void;
}