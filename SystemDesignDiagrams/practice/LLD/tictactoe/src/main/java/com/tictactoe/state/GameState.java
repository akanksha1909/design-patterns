package com.tictactoe.state;

import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;

public interface GameState {
    public void handleMove(Game game, Player player, int row, int col);
}
