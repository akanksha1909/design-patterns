import { ProductManager } from "./Product/ProductManager";
import { UserManager } from "./User/UserManager";
import { InventoryManager } from "./Inventory/InventoryManager";
import { Product } from "./Product/Product";
import { User } from "./User/User";
import { CartManager } from "./Cart/CartManager";

export class EcommercePlatform {
    public productManager: ProductManager;
    public inventoryService: InventoryManager;
    public userManager: UserManager;
    public cartManager: CartManager;
    private static instance: EcommercePlatform;

    private constructor() {
        this.inventoryService = InventoryManager.getInstance();
        this.productManager = ProductManager.getInstance(this.inventoryService);
        this.userManager = UserManager.getInstance();
        this.cartManager = CartManager.getInstance();
    }

    static getInstance(): EcommercePlatform {
        if (!EcommercePlatform.instance) {
            EcommercePlatform.instance = new EcommercePlatform();
        }
        return EcommercePlatform.instance;
    }

    addUser(id: string, name: string, email: string) {
        return this.userManager.addUser(id, name, email);
    }

    addProductStock(id: string, name: string, price: number, quantity: number): Product {
        const product = this.productManager.addProduct(id, name, price);
        this.inventoryService.addInventory(product.id, quantity);
        return product;
    }

    addToCart(user: User, product: Product, quantity: number) {
        if (!this.inventoryService.isAvailableStock(product.id, quantity)) {
            console.log(`Insufficient stock for ${product.name}.`);
            return;
        }
        console.log(`Added ${quantity} of ${product.name} to ${user.name}'s cart.`);
        this.inventoryService.reduceInventory(product.id, quantity);
        
        this.cartManager.addItemToCart(user.id, product.id, quantity)
    }
}