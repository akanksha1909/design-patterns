import { randomUUID as uuid } from 'node:crypto';

export class InvoiceItem {
    public id: string;
    public productId: string;
    public quantity: number;
    public unitPrice: number;

    constructor(productId: string, quantity: number, unitPrice: number) {
        this.id = uuid();
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
}