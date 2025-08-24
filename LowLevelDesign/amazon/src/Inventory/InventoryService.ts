import { Inventory } from "./Inventory";

export class InventoryService {
    public inventories: Map<string, Inventory>;
    private static instance: InventoryService;
    private constructor() {
        this.inventories = new Map();
    }

    static getInstance(): InventoryService {
        if (!InventoryService.instance) {
            InventoryService.instance = new InventoryService();
        }
        return InventoryService.instance;
    }

    addInventory(productId: string, quantity: number): void {
        const inventory= new Inventory(productId, quantity);
        this.inventories.set(inventory.productId, inventory);
    }
}