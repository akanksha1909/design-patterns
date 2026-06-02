package com.tictactoe.state;

import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;

public class InProgressState implements GameState {
    public void handleMove(Game game, Player player, int row, int col) {
        game.getBoard().updateBoard(row, col, player.getSymbol());
        if(game.isWinner()) {
            System.out.println("Game ended. Winner is " + player.getName());
            game.setGameState(new WinnerState());
            game.setGameWinner(game.getCurrentPlayer());
            game.notifyObserver(game);
        } else if (game.getBoard().isFull()) {
            System.out.println("Game is Draw");
            game.setGameState(new DrawState());
        } else {
            game.changePlayer();
        }
    }
}
