import { Product } from './Product';
import { InventoryManager } from '../Inventory/InventoryManager';
import { Inventory } from '../Inventory/Inventory';

export class ProductManager {
    public products: Map<string, Product>;
    private static instance: ProductManager;
    public inventoryService: InventoryManager;
    private constructor(inventoryService: InventoryManager) {
        this.products = new Map();
        this.inventoryService = inventoryService;

    }

    static getInstance(inventoryService: InventoryManager): ProductManager {
        if (!ProductManager.instance) {
            ProductManager.instance = new ProductManager(inventoryService);
        }
        return ProductManager.instance;
    }

    addProduct(id: string, name: string, price: number): Product {
        const product = new Product(id, name, price)
        this.products.set(id, product);
        return product;
    }

    public searchProductByName(name: string): Product[] {
        const result: Product[] = [];
        for (const product of this.products.values()) {
            if (product.name.toLowerCase().includes(name.toLowerCase())) {
                result.push(product);
            }
        }
        return result;
    }
}