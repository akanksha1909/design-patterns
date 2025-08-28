export class Inventory {
    constructor(
        public productId: string,
        public stock: number
    ) { }

    updateStock(quantity: number){
        this.stock += quantity;
    }
}