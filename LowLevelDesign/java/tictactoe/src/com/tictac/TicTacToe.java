package com.tictac;

import com.tictac.entities.Game;
import com.tictac.entities.Player;
import com.tictac.observer.GameObserver;
import com.tictac.observer.Scoreboard;

public class TicTacToe {
    private static TicTacToe instance;
    private Game game;
    private GameObserver scoreboard;
    private TicTacToe(){
        this.scoreboard = new Scoreboard();
    }

    public static synchronized TicTacToe getInstance(){
        if(TicTacToe.instance == null){
            TicTacToe.instance = new TicTacToe();
        }
        return TicTacToe.instance;
    }

    public void createGame(Player player1, Player player2) {
        this.game = new Game(player1, player2);
        System.out.printf("Game started between %s (X) and %s (O) %n", player1.getName(), player2.getName());
        game.addObserver(this.scoreboard);
    }

    public void makeMove(int row, int col, Player player) {
        this.game.makeMove(row, col, player);
    }
}
