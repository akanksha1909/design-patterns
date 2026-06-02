package com.tictactoe.observer;

import com.tictactoe.entities.Game;

public interface GameObserver {
    public void onUpdate(Game game);
}
