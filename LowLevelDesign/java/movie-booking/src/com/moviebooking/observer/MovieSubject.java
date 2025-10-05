package com.moviebooking.observer;

import com.moviebooking.entities.Movie;

import java.util.ArrayList;
import java.util.List;

public class MovieSubject {

    private final List<MovieObserver> observers = new ArrayList<>();
    public void addObserver(MovieObserver observer) {
        observers.add(observer);
    }

    public void removeObserver(MovieObserver observer){
        observers.remove(observer);
    }

    public void notifyObservers(Movie movie) {
        for(MovieObserver observer: observers) {
            observer.update(movie);
        }
    }
}
