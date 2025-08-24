import { v4 as uuidv4 } from 'uuid';

export class CartItem {
    public id: string;

    constructor(
        public cartId: string,
        public productId: string,
        public quantity: number) {
        this.id = uuidv4();
    }

    updateQuantity(quantity: number) {
        this.quantity += quantity;
    }
}