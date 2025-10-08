package com.atm.state;

import com.atm.AtmApplication;
import com.atm.entities.Card;
import com.atm.enums.OperationType;

public interface AtmState {
    void insertCard(AtmApplication atm, String cardNumber);
    void enterPin(AtmApplication atm, String pin);
    void selectOperation(AtmApplication atm, OperationType type, Integer ...args);
    void ejectCard();
}
