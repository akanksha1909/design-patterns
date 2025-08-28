import { EcommercePlatform } from "./ECommercePlatform";
import { CardPaymentStrategy } from "./Payment/CardPaymentStrategy";

export class Demo {
    run() {
        const amazon = EcommercePlatform.getInstance();

        const user1 = amazon.addUser("U1", 'John Doe', 'john.doe@example.com');
        const user2 = amazon.addUser("U2", 'Jane Doe', 'jane@abs.com');

        const laptop = amazon.addProductStock("P1", "Laptop", 1000, 50);
        const book = amazon.addProductStock("P2", "Book", 500, 100);

        amazon.addToCart(user1.id, laptop, 1);
        amazon.addToCart(user1.id, book, 10);

        // console.log(amazon.getUserCart(user1.id))

        amazon.addToCart(user2.id, laptop, 20);
        console.log(amazon.searchProductByName("lap"));
        const order = amazon.placeOrder(user1, new CardPaymentStrategy())
        console.log(amazon.getProductInventory(laptop.id))
        if (order) {
            amazon.deliverOrder(order.id);
        }
    }
}

new Demo().run();