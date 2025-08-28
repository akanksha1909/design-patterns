export class OrderLineItem {
    constructor(
        public productId: string,
        public productName: string,
        public quantity: number,
        public priceAtPurchase: number
    ) {
    }
}