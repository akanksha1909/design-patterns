package com.atm.state;

import com.atm.AtmApplication;
import com.atm.entities.Card;
import com.atm.enums.OperationType;

public class HasCardState implements AtmState {
    public void insertCard(AtmApplication atm, String cardNumber) {

    }

    public void enterPin(AtmApplication atm, String pin) {
        if (atm.getCurrentCard().getPin().equals(pin)) {
            atm.setAtmState(new AuthenticateState());
        } else {
            ejectCard();
        }
    }

    public void selectOperation(AtmApplication atm, OperationType type, Integer ...args) {

    }

    public void ejectCard() {

    }
}
