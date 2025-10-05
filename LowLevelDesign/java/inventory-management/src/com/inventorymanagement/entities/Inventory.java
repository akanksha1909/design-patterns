package com.inventorymanagement.entities;

public class Inventory {
    private final Product product;
    private final Integer quantity;
    private final Warehouse warehouse;
    public Inventory(Product product, Integer quantity, Warehouse warehouse) {
        this.product = product;
        this.quantity = quantity;
        this.warehouse = warehouse;
    }
}
