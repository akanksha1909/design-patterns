package com.vending.entities;

import java.util.UUID;

public class Product {
    private final String name;
    private final Integer price;
    private final String id;
    public Product(String name, Integer price) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.price = price;
    }

    public String getId() {
        return this.id;
    }

    public Integer getPrice() {
        return this.price;
    }
}
