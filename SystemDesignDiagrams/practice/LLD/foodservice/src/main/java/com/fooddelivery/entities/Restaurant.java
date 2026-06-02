package com.fooddelivery.entities;

import com.fooddelivery.observer.OrderObserver;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class Restaurant implements OrderObserver {
    private final String id;
    private final String name;
    private final Address address;
    private Map<String, MenuItem> items = new HashMap<>();

    public Restaurant(String name, Address address) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.address = address;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public Address getAddress() {
        return this.address;
    }

    public Map<String, MenuItem> getItems() {
        return this.items;
    }

    public void addToItem(MenuItem menuItem) {
        items.put(menuItem.getId(), menuItem);
    }

    public void onUpdate(Order order) {
        System.out.printf("--- Notification for Restaurant %s ---\n", getName());
        System.out.printf("  Order %s update: Status is %s.\n", order.getId(), order.getStatus());
        System.out.println("-------------------------------------------\n");
    }

}
