import { CartManager } from "../Cart/CartManager";
import { InventoryManager } from "../Inventory/InventoryManager";
import { PaymentStrategy } from "../Payment/PaymentStrategy";
import { ProductManager } from "../Product/ProductManager";
import { User } from "../User/User";
import { Order, OrderStatus } from "./Order";
import { OrderLineItem } from "./OrderLineItem";

export class OrderManager {

    static instance: OrderManager;
    public orders: Map<string, Order>;  // orderId -> Order

    public inventoryManager: InventoryManager;
    public cartManager: CartManager;
    public productManager: ProductManager;
    private constructor(cartManager: CartManager, productManager: ProductManager, inventoryManager: InventoryManager) {
        this.orders = new Map();
        this.cartManager = cartManager;
        this.productManager = productManager;
        this.inventoryManager = inventoryManager;
    }

    static getInstance(cartManager: CartManager, productManager: ProductManager, inventoryManager: InventoryManager): OrderManager {
        if (!OrderManager.instance) {
            OrderManager.instance = new OrderManager(cartManager, productManager, inventoryManager);
        }
        return OrderManager.instance;
    }

    public createOrder(user: User, paymentStrategy: PaymentStrategy): Order | void {
        const userId = user.getId();
        const cartItems = this.cartManager.getCartItems(userId);
        for (const item in cartItems) {
            const { product, quantity } = cartItems[item];
            if (!this.inventoryManager.isAvailableStock(product.getId(), quantity)) {
                console.log(`Insufficient stock for product ID: ${product.getId()}. Cannot place order.`);
                return;
            }
        }

        const items = []
        for (const item in cartItems) {
            const { product, quantity } = cartItems[item];
            this.inventoryManager.reduceInventory(product.getId(), quantity);
            items.push(new OrderLineItem(product.getId(), product.getName(), quantity, product.getPrice()))
        }

        const totalPrice = this.cartManager.calculateTotalPrice(userId);
        const order = new Order(user, items, totalPrice)
        order.totalPrice = totalPrice;
        this.orders.set(order.id, order);
        this.cartManager.clearCart(userId);

        if (paymentStrategy.makePayment(totalPrice)) {
            order.confirmOrder();
            console.log(`Order ${order.id} placed successfully!`);
            order.shipOrder()
        } else {
            this.cancelOrder(order);
            console.log(`Payment failed. Order ${order.id} has been cancelled.`);
        }
        console.log(order)
        return order;
    }

    public cancelOrder(order: Order): void {
        order.cancelOrder()
        for (const item of order.items) {
            this.inventoryManager.updateInventory(item.productId, item.quantity);
        }
    }
}