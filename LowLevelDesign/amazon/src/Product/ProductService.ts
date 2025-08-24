import { Product } from './Product';
import { InventoryService } from '../Inventory/InventoryService';
import { Inventory } from '../Inventory/Inventory';

export class ProductService {
    public products: Map<string, Product>;
    private static instance: ProductService;
    public inventoryService: InventoryService;
    private constructor(inventoryService: InventoryService) {
        this.products = new Map();
        this.inventoryService = inventoryService;

    }

    static getInstance(inventoryService: InventoryService): ProductService {
        if (!ProductService.instance) {
            ProductService.instance = new ProductService(inventoryService);
        }
        return ProductService.instance;
    }

    addProduct(id: string, name: string, price: number): Product {
        const product = new Product(id, name, price)
        this.products.set(id, product);
        return product;
    }
}