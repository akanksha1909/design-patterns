package com.fooddelivery.entities;

import java.util.UUID;

public class MenuItem {
    private final String id;
    private final String name;
    private final double price;
    public  MenuItem(String id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public double getPrice() {
        return this.price;
    }
}
