package com.tictac.state;

import com.tictac.entities.Game;
import com.tictac.entities.Player;

public class WinnerState implements GameState {
    public void handleMove(Game game, Player player, int row, int col) {
        System.out.printf("Game already won by %s", game.getWinner().getName());
    }
}
