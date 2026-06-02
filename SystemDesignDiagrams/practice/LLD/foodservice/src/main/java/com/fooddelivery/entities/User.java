package com.fooddelivery.entities;

import com.fooddelivery.observer.OrderObserver;

import java.util.UUID;

public abstract class User implements OrderObserver {
    private final String name;
    private final String phone;
    private final String id;

    public User(String name, String phone) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.phone = phone;
    }

    public String getId() { return id; }
    public String getName() { return name; }
}
