import { Mutex } from '../utils'

export class Warehouse {
    private name: string;
    private inventory: Map<string, number>;
    private productMutexes: Map<string, Mutex>;

    // A Mutex to cover product Map mutext
    private mutexMapMutex: Mutex;

    constructor(name: string) {
        this.name = name;
        this.mutexMapMutex = new Mutex();
        this.inventory = new Map();
        this.productMutexes = new Map();
    }

    public getId() {
        return this.name;
    }

    private async getProductMutex(productId: string): Promise<Mutex> {
        return this.mutexMapMutex.execute(() => {
            let productMutex = this.productMutexes.get(productId);
            if(!productMutex) {
                productMutex = new Mutex();
                this.productMutexes.set(productId, productMutex)
            }
            return productMutex;
        })
    }

    async addStock(productId: string, quantity: number) {
        const productMutex = await this.getProductMutex(productId);
        return productMutex.execute(() => {
            const currentQty = this.inventory.get(productId) ?? 0;
            const newQty = currentQty + quantity;
            this.inventory.set(productId, newQty);
        })
    }

    async removeStock(productId: string, quantity: number) {
        const productMutex = await this.getProductMutex(productId);
        return productMutex.execute(() => {
            const currentQty = this.inventory.get(productId) ?? 0;
            if(currentQty <= 0) {
                return;
            }
            const newQty = currentQty - quantity;
            this.inventory.set(productId, newQty);
        })
    }

    getInventory() {
        return this.inventory;
    }
}