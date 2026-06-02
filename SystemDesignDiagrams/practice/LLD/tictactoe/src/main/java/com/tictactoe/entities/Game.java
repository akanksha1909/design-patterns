package com.tictactoe.entities;

import com.tictactoe.observer.GameSubject;
import com.tictactoe.state.GameState;
import com.tictactoe.state.InProgressState;
import com.tictactoe.strategies.ColWinningStrategy;
import com.tictactoe.strategies.RowWinningStrategy;
import com.tictactoe.strategies.WinningStrategy;

import java.util.ArrayList;
import java.util.List;

public class Game extends GameSubject {
    private final Player player1;
    private final Player player2;
    private final Board board;
    private GameState gameState;
    private Player currentPlayer;
    private final List<WinningStrategy> winningStrategies;
    private Player winner;

    public Game(Player player1, Player player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.currentPlayer = player1;
        this.board = new Board(3);
        this.gameState = new InProgressState();
        this.winningStrategies = List.of(new ColWinningStrategy(), new RowWinningStrategy());
    }

    public void handleMove(Player player, int row, int col) {
        this.gameState.handleMove(this, player, row, col);
    }

    public Board getBoard() {
        return this.board;
    }

    public void changePlayer() {
        if(this.currentPlayer == player1) {
            this.currentPlayer = player2;
        } else {
            this.currentPlayer = player1;
        }
    }

    public boolean isWinner() {
        for(WinningStrategy winningStrategy: this.winningStrategies) {
            if(winningStrategy.checkWinner(this)) {
                return true;
            }
        }
        return false;
    }

    public void setGameWinner(Player player) {
        this.winner = player;
    }

    public Player getWinner() {
        return this.winner;
    }

    public Player getCurrentPlayer() {
        return this.currentPlayer;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

}
