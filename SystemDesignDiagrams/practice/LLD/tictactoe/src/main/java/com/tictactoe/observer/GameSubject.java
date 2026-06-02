package com.tictactoe.observer;

import com.tictactoe.entities.Game;

import java.util.HashSet;
import java.util.Set;
import java.util.concurrent.CopyOnWriteArraySet;

public class GameSubject {
    private Set<GameObserver> observers;

    public GameSubject() {
        this.observers = new CopyOnWriteArraySet<>();
    }
    public void addObserver(GameObserver observer) {
        this.observers.add(observer);
    }

    public void removeObserver(GameObserver observer) {
        this.observers.remove(observer);
    }

    public void notifyObserver(Game game) {
        for(GameObserver observer: observers) {
            observer.onUpdate(game);
        }
    }
}
