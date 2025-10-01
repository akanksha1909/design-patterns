package com.fooddelivery.entities;

import java.util.UUID;

public class OrderItem {
    private final String id;
    private final FoodItem foodItem;
    private final Integer quantity;
    private final String name;
    private final double price;

    public OrderItem(FoodItem foodItem, Integer quantity, String name, double price) {
        this.id = UUID.randomUUID().toString();
        this.foodItem = foodItem;
        this.quantity = quantity;
        this.name = name;
        this.price = price;
    }


}
