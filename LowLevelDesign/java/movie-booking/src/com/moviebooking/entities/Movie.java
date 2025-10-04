package com.moviebooking.entities;

import com.moviebooking.observer.MovieSubject;

import java.util.UUID;

public class Movie extends MovieSubject {
    private final String id;
    private final String title;
    private final Integer durationInMinutes;

    public Movie(String title, Integer durationInMinutes) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.durationInMinutes = durationInMinutes;
    }

    public String getId() {
        return this.id;
    }

    public String getTitle() {
        return this.title;
    }

    public Integer getDuration() {
        return this.durationInMinutes;
    }

}
