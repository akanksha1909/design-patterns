package com.fooddelivery.entities;

import com.fooddelivery.FoodDeliveryApp;

import java.util.UUID;

public class FoodItem {
    private final String name;
    private final double price;
    private final String id;

    public FoodItem(String name, double price) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return this.name;
    }

    public double getPrice() {
        return this.price;
    }
}
