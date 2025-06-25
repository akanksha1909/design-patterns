import { Product } from "./Product";

export class Inventory {
    private readonly _products: Map<Product, number>;

    constructor() {
        this._products = new Map();
    }

    addProduct(name: string, price: number, quantity: number) {
        const product = new Product(name, price);
        const currentQuantity = this._products.get(product) || 0;
        this._products.set(product, currentQuantity + quantity);
        return product;
    }

    isAvailable(product: Product) {
        const quantity = this._products.get(product);
        return quantity !== undefined && quantity > 0;
    }

    dispenseProduct(product: Product) {
        const quantity = this._products.get(product);
        if (quantity && quantity > 0) {
            this._products.set(product, quantity - 1);
        } else {
            throw new Error(`Product ${product.name} is not available for dispensing`);
        }
    }
}