import { ProductService } from "./Product/ProductService";
import { InventoryService } from "./Inventory/InventoryService";

export class EcommercePlatform {
    public productService: ProductService;
    public inventoryService: InventoryService;

    constructor() {
        this.inventoryService = InventoryService.getInstance();
        this.productService = ProductService.getInstance(this.inventoryService);
    }

    addProductStock(id: string, name: string, price: number, quantity: number) {
        const product = this.productService.addProduct(id, name, price);
        this.inventoryService.addInventory(product.id, quantity);
    }

}