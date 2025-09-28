package com.tictac.entities;

import com.tictac.state.GameState;
import com.tictac.state.InProgressState;
import com.tictac.strategy.RowWinningStrategy;
import com.tictac.strategy.WinningStrategy;

import java.util.List;

public class Game {
    private final Board board;
    private final GameState gameState;
    private Player currentPlayer;
    private final Player player1;
    private final Player player2;
    private final List<WinningStrategy> winningStrategies;

    public Game(Player player1, Player player2) {
        this.board = new Board(3);
        this.gameState = new InProgressState();
        this.currentPlayer = null;
        this.player1 = player1;
        this.player2 = player2;
        this.winningStrategies = List.of(new RowWinningStrategy());
    }

    public void makeMove(int row, int col, Player player) {
        this.gameState.handleMove(this, player, row, col);
    }
}
