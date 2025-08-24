import { EcommercePlatform } from "./ECommercePlatform";

export class Demo {
    run() {
        const amazon = EcommercePlatform.getInstance();
        amazon.addProductStock("1", "Laptop", 1000, 50);
        amazon.addProductStock("2", "Smartphone", 500, 100);
    }
}

new Demo().run();