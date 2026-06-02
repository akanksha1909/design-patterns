package com.fooddelivery.entities;

import java.util.concurrent.atomic.AtomicBoolean;

public class DeliveryAgent extends User {
    private final Address currentLocation;
    private final AtomicBoolean isAvailable = new AtomicBoolean(true);

    public DeliveryAgent(String name, String phone, Address currentLocation) {
        super(name, phone);
        this.currentLocation = currentLocation;
    }

    public Address getCurrentLocation() {
        return this.currentLocation;
    }

    public void setAvailable(boolean available) {
        this.isAvailable.set(available);
    }

    public synchronized boolean isAvailable() {
        return isAvailable.get();
    }

    public void onUpdate(Order order) {
        System.out.printf("--- Notification for Delivery Agent %s ---\n", getName());
        System.out.printf("  Order %s update: Status is %s.\n", order.getId(), order.getStatus());
        System.out.println("-------------------------------------------\n");
    }
}
