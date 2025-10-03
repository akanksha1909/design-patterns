package com.moviebooking.entities;

import java.util.UUID;

public class City {
    private final String id;
    private final String name;
    public City(String name) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }
}
