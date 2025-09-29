package com.tictac.state;

import com.tictac.entities.Game;
import com.tictac.entities.Player;

public class InProgressState implements GameState {
    public void handleMove(Game game, Player player, int row, int col) {
        game.getBoard().updateBoardCell(row, col, player.getSymbol());
        if(game.checkWinner(player)) {
            game.setWinner(player);
            game.setGameState(new WinnerState());
        } else if (game.getBoard().isFull()) {
            System.out.println("Game ended in draw!");
            game.setGameState(new DrawState());
        } else {
            game.switchPlayer();
        }
    }
}
