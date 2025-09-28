package com.vending;

import com.vending.entities.Product;

import java.util.HashMap;
import java.util.Map;

public class InventoryService {
    private static InventoryService instance;
    private final HashMap<String, Integer> inventory;
    private final HashMap<String, Product> products;
    private InventoryService(){
        this.inventory = new HashMap<>();
        this.products = new HashMap<>();
    }

    public static InventoryService getInstance(){
        if(InventoryService.instance == null) {
            InventoryService.instance = new InventoryService();
        }
        return InventoryService.instance;
    }

    public void addToInventory(Product product, Integer quantity) {
        this.inventory.put(product.getId(), quantity);
        this.products.put(product.getId(), product);
    }

    public boolean isAvailable(String productId) {
        return this.inventory.get(productId) > 0;
    }

    public Product getProduct(String productId) {
        return this.products.get(productId);
    }

    public void dispenseProduct(Product product) {
        Integer quantity = this.inventory.get(product.getId());
        if(quantity > 0) {
            this.inventory.put(product.getId(), quantity - 1);
        }

    }
}
