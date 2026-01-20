import { InventoryApplication } from "./InventoryApplication"
import { Product } from "./entities/Product"
import { delay } from "./utils";

class Demo {
    async run() {
        const service = await InventoryApplication.getInstance();

        const promises = []
        for(let i = 0; i<5;i++) {
            promises.push(service.createWarehouse("Warehouse " + i))
        }

        await Promise.all(promises);
        const warehouse = service.getWarehouse("Warehouse 1");

        const iphone = new Product("iPhone")
        const apple = new Product("Apple");

        const p = []
        p.push(service.addProductToWarehouse(warehouse.getId(), iphone.getId(), 12));
        p.push(service.removeProductFromWarehouse(warehouse.getId(), iphone.getId(), 5));


        p.push(service.addProductToWarehouse(warehouse.getId(), apple.getId(), 10));
        p.push(service.removeProductFromWarehouse(warehouse.getId(), apple.getId(), 4));
        
        await Promise.all(p)
        const inventories = service.getInventoryOfWarehouse(warehouse.getId())
        inventories.forEach((value, key) => {
            console.log("key: ", key, "value: ", value)
        })
    }
}  

new Demo().run()