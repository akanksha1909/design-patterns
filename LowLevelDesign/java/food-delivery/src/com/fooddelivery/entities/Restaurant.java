package com.fooddelivery.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Restaurant {
    private final String id;
    private final String name;
    private final Address address;
    private List<FoodItem> fooditems;

    public Restaurant(String name, Address address) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.address = address;
        this.fooditems = new ArrayList<>();
    }

    public String getId() {
        return this.id;
    }

    public String getName(){
        return this.name;
    }

    public Address getAddress() {
        return this.address;
    }

    public void addFoodItem(FoodItem foodItem) {
        this.fooditems.add(foodItem);
    }

    public List<FoodItem> getFoodItem() {
        return this.fooditems;
    }
}
