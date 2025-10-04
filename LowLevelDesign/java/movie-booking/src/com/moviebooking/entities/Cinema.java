package com.moviebooking.entities;

import java.util.List;
import java.util.UUID;

public class Cinema {
    private final String id;
    private final String name;
    private final City city;
    private final List<Screen> screens;
    public Cinema(String name, City city, List<Screen> screens) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.city = city;
        this.screens = screens;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public City getCity() {
        return this.city;
    }
}
