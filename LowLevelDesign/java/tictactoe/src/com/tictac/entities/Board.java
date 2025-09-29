package com.tictac.entities;

import com.tictac.enums.Symbol;

import java.util.List;

public class Board {
    private final Integer size;
    private final Cell[][] board;
    public Board(Integer size) {
        this.size = size;
        this.board = new Cell[size][size];
        for(int i=0;i<size;i++) {
            for(int j=0;j<size;j++){
                board[i][j] = new Cell(i, j);
            }
        }
    }

    public void updateBoardCell(int row, int col, Symbol symbol) {
        this.board[row][col].updateCell(symbol);
    }

    public boolean isFull() {
        for(int i = 0; i < this.size; i ++) {
            for(int j=0; j < this.size; j++) {
                if(this.board[i][j].isEmpty()) {
                    return false;
                }
            }
        }
        return true;
    }

    public int getSize() {
        return this.size;
    }

    public Cell[][] getBoard() {
        return this.board;
    }
}
