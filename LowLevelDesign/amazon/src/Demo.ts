import { EcommercePlatform } from "./ECommercePlatform";

export class Demo {
    run() {
        const amazon = EcommercePlatform.getInstance();

        const user1 = amazon.addUser("U1", 'John Doe', 'john.doe@example.com');
        const user2 = amazon.addUser("U2", 'Jane Doe', 'jane@abs.com');

        const laptop = amazon.addProductStock("P1", "Laptop", 1000, 50);
        const book = amazon.addProductStock("P2", "Book", 500, 100);

        amazon.addToCart(user1, laptop, 1);
        amazon.addToCart(user1, book, 10);
    }
}

new Demo().run();