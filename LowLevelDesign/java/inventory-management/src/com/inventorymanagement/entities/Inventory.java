package com.inventorymanagement.entities;

import com.inventorymanagement.observer.InventoryObserver;
import com.inventorymanagement.observer.InventorySubject;

public class Inventory extends InventorySubject  {
    private final Product product;
    private final Warehouse warehouse;
    private Integer quantity;
    private Integer threshold;
    public Inventory(Product product, Integer quantity, Warehouse warehouse, Integer threshold, InventoryObserver observer) {
        this.product = product;
        this.quantity = quantity;
        this.warehouse = warehouse;
        this.threshold = threshold;
        this.addObserver(observer);
    }

    public synchronized void updateStock(Integer quantity) {
        this.quantity += quantity;
        this.notifyObservers(this);
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public Integer getThreshold() {
        return this.threshold;
    }

    public Product getProduct() {
        return this.product;
    }

    public Warehouse getWarehouse() {
        return this.warehouse;
    }
}
