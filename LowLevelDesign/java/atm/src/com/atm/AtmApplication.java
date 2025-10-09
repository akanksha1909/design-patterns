package com.atm;

import com.atm.dispenserchain.*;
import com.atm.entities.Card;
import com.atm.enums.OperationType;
import com.atm.state.AtmState;
import com.atm.state.IdleState;

public class AtmApplication {
    private static AtmApplication instance;
    private AtmState currentState;
    private Card currentCard;
    public BankService bankService = BankService.getInstance();
    private CashDispenser cashDispenser;
    private AtmApplication(){
        this.currentState = new IdleState();
        DispenseChain c1 = new NoteDispenser100(1);
        DispenseChain c2 = new NoteDispenser50(10);
        DispenseChain c3 = new NoteDispenser20(2);
        c1.setNextChain(c2);
        c2.setNextChain(c3);
        this.cashDispenser = new CashDispenser(c1);
    }

    public static synchronized AtmApplication getInstance() {
        if(instance == null) {
            instance = new AtmApplication();
        }
        return instance;
    }

    public void setAtmState(AtmState state) {
        this.currentState = state;
    }

    public void setCurrentCard(Card card) {
        this.currentCard = card;
    }

    public Card getCurrentCard() {
        return this.currentCard;
    }

    public void insertCard(String cardNumber) {
        this.currentState.insertCard(this, cardNumber);
    }

    public void enterPin(String pin) {
        this.currentState.enterPin(this, pin);
    }

    public void selectOperation(OperationType type, Integer ...args) {
        this.currentState.selectOperation(this, type, args);
    }

    public void withdrawCash(int amount) {
        if(!cashDispenser.canDispense(amount)) {
            throw new IllegalStateException("Insufficient cash available in the ATM");
        }
        bankService.withdrawAmount(this.currentCard, amount);
        try {
            this.cashDispenser.dispenseCash(amount);
        } catch (Exception e) {
            bankService.depositMoney(this.currentCard, amount);
        }

    }

}
