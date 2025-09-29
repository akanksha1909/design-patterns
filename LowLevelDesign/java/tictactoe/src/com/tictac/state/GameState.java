package com.tictac.state;

import com.tictac.entities.Game;
import com.tictac.entities.Player;

public interface GameState {
    public void handleMove(Game game, Player player, int row, int col);
}
