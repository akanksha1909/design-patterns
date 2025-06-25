export class Product {
    private readonly _price: number;
    private readonly _name: string;
    constructor(name: string, price: number) {
        this._name = name;
        this._price = price;
    }

    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }
}