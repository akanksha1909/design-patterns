package com.tictac;

import com.tictac.entities.Game;
import com.tictac.entities.Player;

public class TicTacToe {
    private static TicTacToe instance;
    private Game game;
    private TicTacToe(){
    }

    public static TicTacToe getInstance(){
        if(TicTacToe.instance == null){
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }

    public void createGame(Player player1, Player player2) {
        this.game = new Game(player1, player2);
        System.out.printf("Game started between %s (X) and %s (O) %n", player1.getName(), player2.getName());
    }

    public void makeMove(int row, int col, Player player) {
        this.game.makeMove(row, col, player);
    }
}
