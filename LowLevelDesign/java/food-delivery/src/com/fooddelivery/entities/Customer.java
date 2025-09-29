package com.fooddelivery.entities;

public class Customer extends User{
    private final Address address;
    public Customer(String name, String phone, Address address) {
        super(name, phone);
        this.address = address;
    }
}
