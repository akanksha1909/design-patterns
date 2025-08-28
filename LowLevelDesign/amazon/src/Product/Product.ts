export class Product {
    constructor(
        public id: string,
        public name: string,
        public price: number
    ) {

    }
    public getId(): string { return this.id; }
    public getName(): string { return this.name; }
    public getPrice(): number { return this.price; }

}