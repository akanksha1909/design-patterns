package com.learnings.javathreads.exercise.producerconsumerchallenge;

import java.util.UUID;

public class Order {
    private final String id;
    private final String shoeType;
    private final Integer quantity;

    public Order(String shoeType, Integer quantity) {
        this.id = UUID.randomUUID().toString();
        this.shoeType = shoeType;
        this.quantity = quantity;
    }
}
