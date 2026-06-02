package com.tictactoe.entities;

import com.tictactoe.enums.Symbol;

public class Player {
    private final String name;
    private final Symbol symbol;
    public Player(String name, Symbol symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    public Symbol getSymbol() {
        return this.symbol;
    }

    public String getName() {
        return this.name;
    }
}
