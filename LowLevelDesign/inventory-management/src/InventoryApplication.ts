import { Warehouse } from "./entities/Warehouse";
import { delay, Mutex } from "./utils";

export class InventoryApplication {
    private static instance: InventoryApplication;
    private warehouses: Map<string, Warehouse>;
    private static instanceMutex: Mutex = new Mutex();
    private warehousesMutex;

    private constructor() {
        this.warehouses = new Map();
        this.warehousesMutex = new Mutex();
    }

    public static async getInstance() {
        if(this.instance == null) {
            await this.instanceMutex.execute(async () => {
                if(this.instance == null) {
                    await delay(1000)
                    console.log("Inventory service created")
                    this.instance = new InventoryApplication()
                }
            })
 
        }
        return this.instance;
    }

    public async createWarehouse(name: string){
        return this.warehousesMutex.execute(async () => {
            const warehouse = new Warehouse(name);
            await delay(1000)
            this.warehouses.set(warehouse.getId(), warehouse);
            return warehouse;
        })
    }

    public async addProductToWarehouse(warehouseId: string, productId: string, quantity: number) {
        const warehouse = await this.warehousesMutex.execute(() => {
            const w = this.warehouses.get(warehouseId)
            if(!w) {
                throw new Error(`Warehouse with ${warehouseId} not found`)
            }
            return w;
        })
        await warehouse.addStock(productId, quantity);
    }

    public async removeProductFromWarehouse(warehouseId: string, productId: string, quantity: number) {
        const warehouse = await this.warehousesMutex.execute(() => {
            const w = this.warehouses.get(warehouseId)
            if(!w) {
                throw new Error(`Warehouse with ${warehouseId} not found`)
            }
            return w;
        })
        await warehouse.removeStock(productId, quantity);
    }

    public getInventoryOfWarehouse(warehouseId: string): Map<string, number> {
        const warehouse = this.warehouses.get(warehouseId)
        return warehouse.getInventory();
    }

    public getWarehouse(warehouseId) {
        return this.warehouses.get(warehouseId)
    }
}