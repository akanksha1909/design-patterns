package com.fooddelivery.entities;

import java.util.UUID;

abstract public class User {
    private final String id;
    private final String name;
    private final String phone;
    public User(String name, String phone) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.phone = phone;
    }

    public String getId(){
        return this.id;
    }
}
