import { v4 as uuidv4 } from 'uuid';
import { Product } from '../Product/Product';

export class CartItem {
    public id: string;

    constructor(
        public cartId: string,
        public product: Product,
        public quantity: number) {
        this.id = uuidv4();
    }

    updateQuantity(quantity: number) {
        this.quantity += quantity;
    }
}