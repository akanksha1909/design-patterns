package com.moviebooking.observer;

import com.moviebooking.entities.Movie;

public interface MovieObserver {
    void update(Movie movie);
}
