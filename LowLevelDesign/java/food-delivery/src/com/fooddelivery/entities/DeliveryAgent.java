package com.fooddelivery.entities;

public class DeliveryAgent extends User {
    private Address currentLocation;

    public DeliveryAgent(String name, String phone, Address currentLocation){
        super(name, phone);
        this.currentLocation = currentLocation;
    }
}
