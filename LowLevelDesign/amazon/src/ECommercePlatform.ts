import { ProductManager } from "./Product/ProductManager";
import { UserManager } from "./User/UserManager";
import { InventoryManager } from "./Inventory/InventoryManager";
import { Product } from "./Product/Product";
import { OrderManager } from "./Order/OrderManager";
import { CartManager } from "./Cart/CartManager";
import { Order } from "./Order/Order";
import { PaymentStrategy } from "./Payment/PaymentStrategy";
import { User } from "./User/User";

export class EcommercePlatform {
    public productManager: ProductManager;
    public inventoryService: InventoryManager;
    public userManager: UserManager;
    public cartManager: CartManager;
    public orderManager: OrderManager;

    private static instance: EcommercePlatform;

    private constructor() {
        this.inventoryService = InventoryManager.getInstance();
        this.productManager = ProductManager.getInstance(this.inventoryService);
        this.userManager = UserManager.getInstance();
        this.cartManager = CartManager.getInstance();
        this.orderManager = OrderManager.getInstance(this.cartManager, this.productManager, this.inventoryService);
    }

    static getInstance(): EcommercePlatform {
        if (!EcommercePlatform.instance) {
            EcommercePlatform.instance = new EcommercePlatform();
        }
        return EcommercePlatform.instance;
    }

    searchProductByName(name: string): Product[] {
        return this.productManager.searchProductByName(name);
    }

    addUser(id: string, name: string, email: string) {
        return this.userManager.addUser(id, name, email);
    }

    addProductStock(id: string, name: string, price: number, quantity: number): Product {
        const product = this.productManager.addProduct(id, name, price);
        this.inventoryService.addInventory(product.id, quantity);
        return product;
    }

    addToCart(userId: string, product: Product, quantity: number) {
        if (!this.inventoryService.isAvailableStock(product.id, quantity)) {
            console.log(`Insufficient stock for ${product.name}.`);
            return;
        }
        this.cartManager.addItemToCart(userId, product, quantity)
    }

    placeOrder(user: User, paymentStrategy: PaymentStrategy): Order | void {
        return this.orderManager.createOrder(user, paymentStrategy)
    }

    deliverOrder(orderId: string): void {
        const order = this.orderManager.orders.get(orderId);
        order?.deliverOrder();
    }

    getProductInventory(productId: string): number {
        return this.inventoryService.getStock(productId);
    }
}