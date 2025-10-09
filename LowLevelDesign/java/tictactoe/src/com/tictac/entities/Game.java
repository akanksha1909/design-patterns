package com.tictac.entities;

import com.tictac.observer.GameSubject;
import com.tictac.state.GameState;
import com.tictac.state.InProgressState;
import com.tictac.strategy.RowWinningStrategy;
import com.tictac.strategy.WinningStrategy;

import java.util.List;

public class Game extends GameSubject {
    private final Board board;
    private GameState gameState;
    private Player currentPlayer;
    private final Player player1;
    private final Player player2;
    private final List<WinningStrategy> winningStrategies;
    private Player winner;

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

    public Board getBoard() {
        return this.board;
    }

    public Player getWinner(){
        return this.winner;
    }

    public boolean checkWinner(Player player) {
        for(WinningStrategy winningStrategy: this.winningStrategies) {
            if(winningStrategy.checkWinner(this.board, player)) {
                System.out.printf("Player %s has won the game! Strategy %s", player.getName(), winningStrategy.getClass().getSimpleName());
                return true;
            }
        };
        return false;
    }

    public void setGameState(GameState gameState) {
        this.gameState = gameState;
    }

    public void setWinner(Player player) {
        this.winner = player;
    }

    public void switchPlayer(){
        if(this.currentPlayer == this.player1) {
            this.currentPlayer = this.player2;
        } else {
            this.currentPlayer = this.player1;
        }
    }
}
