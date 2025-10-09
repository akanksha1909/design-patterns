package com.tictac.observer;

import com.tictac.entities.Game;

public interface GameObserver {
    void update(Game game);
}
