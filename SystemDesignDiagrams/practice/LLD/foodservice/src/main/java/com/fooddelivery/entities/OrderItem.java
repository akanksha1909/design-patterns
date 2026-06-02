package com.fooddelivery.entities;

public class OrderItem {
    private final MenuItem item;
    private final int quantity;

    public OrderItem(MenuItem item, Integer quantity) {
        this.item = item;
        this.quantity = quantity;
    }

    public MenuItem getItem() {
        return this.item;
    }

    public Integer getQuantity() {
        return this.quantity;
    }
}
