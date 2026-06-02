package com.tictactoe;

import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;
import com.tictactoe.observer.GameObserver;
import com.tictactoe.observer.Scoreboard;

public class TicTacToeApplication {
    private static TicTacToeApplication instance;
    private Game game;
    private Scoreboard scoreboard;

    private TicTacToeApplication() {
        this.scoreboard = new Scoreboard();
    }

    public static TicTacToeApplication getInstance() {
        if(TicTacToeApplication.instance == null) {
            TicTacToeApplication.instance = new TicTacToeApplication();
        }
        return TicTacToeApplication.instance;
    }

    public void createGame(Player player1, Player player2) {
        Game game = new Game(player1, player2);
        this.game = game;
        game.addObserver(scoreboard);
    }

    public void makeMove(Player player, int row, int col) {
        this.game.handleMove(player, row, col);
    }

    public void printBoard() {
        this.game.getBoard().printBoard();
    }

    public void printScoreBoard() {
        this.scoreboard.printScores();
    }
}
