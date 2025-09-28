package com.vending.enums;

public enum Coin {
    PENNY(1),
    NICKEL(5),
    DIME(10),
    QUARTER(25);

    private final Integer value;
    Coin(int value) {
        this.value = value;
    }

    public Integer getValue() {
        return value;
    }
}
