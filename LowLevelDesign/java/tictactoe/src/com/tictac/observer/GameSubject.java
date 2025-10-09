package com.tictac.observer;

import com.tictac.entities.Game;

import java.util.ArrayList;
import java.util.List;

public class GameSubject {
    private List<GameObserver> observers = new ArrayList<>();
    public void addObserver(GameObserver observer) {
        this.observers.add(observer);
    }

    public void removeObserver(GameObserver observer) {
        this.observers.remove(observer);
    }

    public void notifyObservers(Game game) {
        System.out.println(this.observers);
        for(GameObserver observer: this.observers) {
            observer.update(game);
        }
    }
}
