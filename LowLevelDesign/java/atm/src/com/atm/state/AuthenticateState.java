package com.atm.state;

import com.atm.AtmApplication;
import com.atm.entities.Card;
import com.atm.enums.OperationType;

public class AuthenticateState implements AtmState {
    public void insertCard(AtmApplication atm, String cardNumber) {

    }

    public void enterPin(AtmApplication atm, String pin) {

    }

    public void selectOperation(AtmApplication atm, OperationType type, Integer ...args) {
        switch (type) {
            case CHECK_BALANCE:
                double balance = atm.bankService.getBalance(atm.getCurrentCard());
                System.out.printf("Your current account balance is: %.2f%n", balance);
                break;
            case WITHDRAW_CASH:
                break;
            case DEPOSIT_CASH:
                break;
            default:
                System.out.println("Not a valid operation" + type);
                break;
        }
    }

    public void ejectCard() {

    }
}
