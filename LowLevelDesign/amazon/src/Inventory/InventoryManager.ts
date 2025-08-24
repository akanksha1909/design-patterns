import { Inventory } from "./Inventory";

export class InventoryManager {
    public inventories: Map<string, Inventory>;
    private static instance: InventoryManager;
    private constructor() {
        this.inventories = new Map();
    }

    static getInstance(): InventoryManager {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }

    addInventory(productId: string, quantity: number): void {
        const inventory= new Inventory(productId, quantity);
        this.inventories.set(inventory.productId, inventory);
    }
}