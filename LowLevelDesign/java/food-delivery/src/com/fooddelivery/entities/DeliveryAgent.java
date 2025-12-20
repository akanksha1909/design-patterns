package com.fooddelivery.entities;

import java.util.concurrent.atomic.AtomicBoolean;

public class DeliveryAgent extends User {
    private Address currentLocation;
    private final AtomicBoolean isAvailable = new AtomicBoolean(true);

    public DeliveryAgent(String name, String phone, Address currentLocation){
        super(name, phone);
        this.currentLocation = currentLocation;
    }

    public void setAvailable(boolean available) {
        this.isAvailable.set(available);
    }

    public synchronized boolean isAvailable() {
        return isAvailable.get();
    }

    public Address getCurrentLocation() {
        return this.currentLocation;
    }


}
