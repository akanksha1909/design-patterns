package com.moviebooking.entities;

import com.moviebooking.observer.MovieObserver;

import java.util.UUID;

public class User implements MovieObserver {
    private final String id;
    private final String name;
    private final String email;
    public User(String name, String email) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.email = email;
    }

    public String getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getEmail() {
        return this.email;
    }

    public void update(Movie movie) {
        System.out.printf("Movie '%s' is not available for booking!%n", movie.getTitle());
    }
}
