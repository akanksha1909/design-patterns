package com.tictactoe.entities;

import com.tictactoe.enums.Symbol;

public class Board {
    private final Cell[][] board;
    private final int size;
    public Board(int size) {
        this.size = size;
        this.board = new Cell[size][size];
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
                board[i][j] = new Cell(i, j);
            }
        }
    }

    public void updateBoard(int row, int col, Symbol symbol) {
        this.board[row][col].updateCell(symbol);
    }

    public int getSize() {
        return this.size;
    }

    public Cell[][] getBoard() {
        return this.board;
    }

    public boolean isFull() {
        boolean isFull = true;
        for(int i = 0; i < size; i++) {
            for(int j = 0; j < size; j++) {
                if(board[i][j].getSymbol() == null) {
                    isFull = false;
                    break;
                }
            }
        }
        return isFull;
    }

    public void printBoard() {
        System.out.println("-------------");
        for (int i = 0; i < size; i++) {
            System.out.print("| ");
            for (int j = 0; j < size; j++) {
                Symbol symbol = board[i][j].getSymbol();
                if(symbol != null) {
                    System.out.print(symbol + " | ");
                }
            }
            System.out.println("\n-------------");
        }
    }
}
