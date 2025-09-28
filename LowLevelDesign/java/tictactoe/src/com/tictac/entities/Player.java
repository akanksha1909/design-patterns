package com.tictac.entities;

import com.tictac.enums.Symbol;

public class Player {
    private final String name;
    private final Symbol symbol;
    public Player(String name, Symbol symbol){
        this.name = name;
        this.symbol = symbol;
    }

    public String getName() {
        return this.name;
    }

    public Symbol getSymbol() {
        return this.symbol;
    }
}
