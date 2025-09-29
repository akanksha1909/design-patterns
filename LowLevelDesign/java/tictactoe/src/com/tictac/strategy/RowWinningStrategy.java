package com.tictac.strategy;

import com.tictac.entities.Board;
import com.tictac.entities.Player;

public class RowWinningStrategy implements WinningStrategy {
    public boolean checkWinner(Board board, Player player) {
        for(int i=0;i<board.getSize();i++) {
            boolean rowWin = true;
            for(int j=0;j<board.getSize();j++) {
                if(board.getBoard()[i][j].getSymbol() != player.getSymbol()) {
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
