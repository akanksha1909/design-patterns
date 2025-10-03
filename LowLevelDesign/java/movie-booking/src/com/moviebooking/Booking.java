package com.moviebooking;

import com.moviebooking.entities.User;

import java.util.UUID;

public class Booking {
    private final String id;
    private final User user;
    public Booking(User user) {
        this.id = UUID.randomUUID().toString();
        this.user = user;
    }
}
