package com.tictactoe.strategies;

import com.tictactoe.entities.Board;
import com.tictactoe.entities.Game;
import com.tictactoe.entities.Player;

public class RowWinningStrategy implements WinningStrategy {
    public boolean checkWinner(Game game) {
        Board board = game.getBoard();
        Player currentPlayer = game.getCurrentPlayer();
            for(int i=0;i<board.getSize();i++) {
                boolean rowWin = true;
                for(int j=0;j<board.getSize();j++) {
                    if(board.getBoard()[i][j].getSymbol() != currentPlayer.getSymbol()) {
                        rowWin = false;
                        break;
                    }
                }
                if(rowWin) {
                    return true;
                }
            }


        return false;
    }
}
