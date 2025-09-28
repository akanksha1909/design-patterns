package com.tictac.strategy;

import com.tictac.entities.Board;
import com.tictac.entities.Player;

public interface WinningStrategy {
    public boolean checkWinner(Board board, Player player);
}
