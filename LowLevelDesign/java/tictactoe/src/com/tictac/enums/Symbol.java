package com.tictac.enums;

public enum Symbol {
    X('X'),
    O('O');

    private final char symbol;
    Symbol(char symbol) {
        this.symbol = symbol;
    }

    public char getSymbol(){
        return this.symbol;
    }
}
