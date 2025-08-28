import { v4 as uuidv4 } from 'uuid';
import { Product } from "../Product/Product";
import { OrderLineItem } from "./OrderLineItem";
import { OrderState } from './OrderState/OrderState';
import { PlacedState } from './OrderState/PlacedState';
import { OrderSubject } from './notify/Observable/OrderSubject';
import { User } from '../User/User';

export enum OrderStatus {
    PLACED,
    CONFIRMED,
    SHIPPED,
    DELIVERED,
    CANCELED,
}

export class Order extends OrderSubject {
    public id: string;
    public status: OrderStatus;
    public currentState: OrderState;
    constructor(
        public user: User,
        public items: OrderLineItem[],
        public totalPrice: number
    ) {
        super();
        this.id = uuidv4();
        this.status = OrderStatus.PLACED;
        this.currentState = new PlacedState();
        this.addObserver(this.user);
    }

    public getId(): string { return this.id; }

    public setStatus(status: OrderStatus): void {
        this.status = status;
        this.notifyObservers(this);
    }

    public setState(state: OrderState): void {
        this.currentState = state;
    }

    public shipOrder(): void {
        this.currentState.shipOrder(this);
    }

    public deliverOrder(): void {
        this.currentState.deliverOrder(this);
    }

    confirmOrder() {
        if (this.status != OrderStatus.PLACED) {
            throw new Error('Invalid status!');
        }
        this.status = OrderStatus.CONFIRMED;
    }

    cancelOrder() {
        if (this.status > OrderStatus.SHIPPED) {
            throw new Error('Invalid status!');
        }
        this.currentState.cancelOrder(this);
    }
}