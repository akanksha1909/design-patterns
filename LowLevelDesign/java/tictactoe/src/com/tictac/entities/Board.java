package com.tictac.entities;

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
}
