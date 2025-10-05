package com.inventorymanagement.entities;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class Warehouse {
    private final String id;
    private final String name;
    private Map<String, Inventory> inventories;
    public Warehouse(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.inventories = new ConcurrentHashMap<>();
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public Inventory getInventoryOfProduct(String productId) {
        return this.inventories.get(productId);
    }

    public void addProductToInventory(String productId, Inventory inventory) {
        this.inventories.put(productId, inventory);
    }
}
