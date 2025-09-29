package com.tictac.entities;

import com.tictac.enums.Symbol;

public class Cell {
    private final int row;
    private final int col;
    private Symbol symbol;
    public Cell(int row, int col) {
        this.row = row;
        this.col = col;
    }

    public void updateCell(Symbol symbol) {
        this.symbol = symbol;
    }

    public boolean isEmpty() {
        return this.symbol == null;
    }

    public Symbol getSymbol() {
        return this.symbol;
    }
}
