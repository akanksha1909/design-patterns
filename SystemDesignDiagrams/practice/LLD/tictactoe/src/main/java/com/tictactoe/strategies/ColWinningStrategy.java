package com.tictactoe.strategies;

import com.tictactoe.entities.Board;
import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;

public class ColWinningStrategy implements WinningStrategy {
    public boolean checkWinner(Game game) {
        Board board = game.getBoard();
        Player currentPlayer = game.getCurrentPlayer();
            for(int col = 0; col < board.getSize(); col++) {
                boolean isCol = true;
                for(int row= 0; row < board.getSize(); row++) {
                    if(board.getBoard()[row][col].getSymbol() != currentPlayer.getSymbol()) {
                        isCol = false;
                        break;
                    }
                }
                if(isCol) {
                    return true;
                }
            }


        return false;
    }
}
