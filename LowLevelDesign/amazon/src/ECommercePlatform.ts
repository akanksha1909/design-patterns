import { ProductManager } from "./Product/ProductManager";
import { InventoryManager } from "./Inventory/InventoryManager";

export class EcommercePlatform {
    public productManager: ProductManager;
    public inventoryService: InventoryManager;
    private static instance: EcommercePlatform;

    private constructor() {
        this.inventoryService = InventoryManager.getInstance();
        this.productManager = ProductManager.getInstance(this.inventoryService);
    }

    static getInstance(): EcommercePlatform {
        if (!EcommercePlatform.instance) {
            EcommercePlatform.instance = new EcommercePlatform();
        }
        return EcommercePlatform.instance;
    }

    addProductStock(id: string, name: string, price: number, quantity: number) {
        const product = this.productManager.addProduct(id, name, price);
        this.inventoryService.addInventory(product.id, quantity);
    }

}