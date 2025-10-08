package com.atm.state;

public interface AtmState {
    void insertCard();
    void enterPin();
    void selectOperation();
    void ejectCard();
}
