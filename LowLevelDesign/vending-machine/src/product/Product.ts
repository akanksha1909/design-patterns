export class Product {
    private readonly _price: number;
    private readonly _name: string;
    constructor(name: string, price: number) {
        if (!name.trim()) {
            throw new Error('Product name cannot be empty');
        }
        if (!Number.isFinite(price) || price <= 0) {
            throw new Error('Product price must be a positive number');
        }
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