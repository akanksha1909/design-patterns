package com.tictactoe.strategies;

import com.tictactoe.entities.Game;

public interface WinningStrategy {
    public boolean checkWinner(Game game);
}
