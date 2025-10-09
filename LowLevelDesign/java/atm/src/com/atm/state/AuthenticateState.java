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
        System.out.println(args[0]);
        switch (type) {
            case CHECK_BALANCE:
                double balance = atm.bankService.getBalance(atm.getCurrentCard());
                System.out.printf("Your current account balance is: %.2f%n", balance);
                break;
            case WITHDRAW_CASH:
                double currentBalance = atm.bankService.getBalance(atm.getCurrentCard());
                if (args[0] > currentBalance) {
                    System.out.println("Insufficient balance");
                } else {
                    atm.withdrawCash(args[0]);
                }
                break;
            case DEPOSIT_CASH:
                atm.bankService.depositMoney(atm.getCurrentCard(), args[0]);
                break;
            default:
                System.out.println("Not a valid operation" + type);
                break;
        }
    }

    public void ejectCard() {

    }
}
