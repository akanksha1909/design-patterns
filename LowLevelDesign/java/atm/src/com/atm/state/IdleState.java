package com.atm.state;

import com.atm.AtmApplication;
import com.atm.entities.Card;
import com.atm.enums.OperationType;

public class IdleState implements AtmState {
    public void insertCard(AtmApplication atm, String cardNumber) {
        Card card = atm.bankService.getCard(cardNumber);
        if(card == null) {
            System.out.println("Invalid Card");
            ejectCard();
        } else {
            atm.setCurrentCard(card);
            atm.setAtmState(new HasCardState());
        }
    }

    public void enterPin(AtmApplication atm, String pin) {

    }

    public void selectOperation(AtmApplication atm, OperationType type, Integer ...args) {

    }

    public void ejectCard() {

    }
}
