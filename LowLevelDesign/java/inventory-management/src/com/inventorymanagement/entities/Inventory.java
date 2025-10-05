package com.inventorymanagement.entities;

public class Inventory {
    private final Product product;
    private final Warehouse warehouse;
    private Integer quantity;
    public Inventory(Product product, Integer quantity, Warehouse warehouse) {
        this.product = product;
        this.quantity = quantity;
        this.warehouse = warehouse;
    }

    public void updateStock(Integer quantity) {
        this.quantity += quantity;
    }

    public Integer getQuantity() {
        return this.quantity;
    }
}
