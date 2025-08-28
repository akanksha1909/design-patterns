import { Product } from "../Product/Product";
import { Cart } from "./Cart";
import { CartItem } from "./CartItem";

export class CartManager {
    private static instance: CartManager;
    private carts: Map<string, Cart> = new Map(); // userId -> Cart
    private cartItems: Map<string, CartItem[]> = new Map(); // cartId -> CartItem[]

    private constructor() { }

    static getInstance(): CartManager {
        if (!CartManager.instance) {
            CartManager.instance = new CartManager();
        }
        return CartManager.instance;
    }

    createUserCart(userId: string): Cart {
        let cart = this.carts.get(userId);
        if (!cart) {
            cart = new Cart(userId);
            this.carts.set(userId, cart);
            this.cartItems.set(cart.id, []);
        }
        return cart;
    }

    getUserCart(userId: string): Cart | undefined {
        if(!this.carts.has(userId)) {
            return this.createUserCart(userId);
        }
        return this.carts.get(userId);
    }

    addItemToCart(userId: string, product: Product, quantity: number): void {
        const cart = this.getUserCart(userId);
        if (!cart) {
            throw new Error("Cart not found for user");
        }
        const items = this.cartItems.get(cart.id) || [];
        const existingCartItem = items.find(item => item.product.getId() === product.getId());
        if (existingCartItem) {
            existingCartItem.updateQuantity(quantity);
        } else {
            items.push(new CartItem(cart.id, product, quantity));
        }
        this.cartItems.set(cart.id, items);
    }

    getCartItems(userId: string): CartItem[] {
        const cart = this.carts.get(userId);
        if (!cart) return [];
        return this.cartItems.get(cart.id) || [];
    }

    calculateTotalPrice(userId: string): number {
        const cart = this.carts.get(userId);  
        if (!cart) return 0;
        let total = 0;
        const items = this.cartItems.get(cart.id) || [];    
          for (const item of items) {
            total += item.product.getPrice() * item.quantity;
        }
        return total
    }

    clearCart(userId: string): void {
        const cart = this.carts.get(userId);
        if (cart) {
            this.cartItems.set(cart.id, []);
        }
    }
}
