package com.moviebooking.entities;

import java.time.LocalDateTime;
import java.util.UUID;

public class Show {
    private final String id;
    private final Movie movie;
    private final Screen screen;
    private final LocalDateTime startTime;
    public Show(Movie movie, Screen screen, LocalDateTime startTime) {
        this.id = UUID.randomUUID().toString();
        this.movie = movie;
        this.screen = screen;
        this.startTime = startTime;
    }

    public String getId() {
        return  this.id;
    }

    public Movie getMovie() {
        return this.movie;
    }

    public Screen getScreen() {
        return this.screen;
    }

}
