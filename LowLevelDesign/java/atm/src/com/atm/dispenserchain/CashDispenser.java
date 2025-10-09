package com.atm.dispenserchain;

public class CashDispenser {
    private final DispenseChain chain;
    public CashDispenser(DispenseChain chain) {
        this.chain = chain;
    }

    public synchronized void dispenseCash(int amount) {
        chain.dispense(amount);
    }

    public synchronized boolean canDispense(int amount) {
        if(amount % 10 != 0) {
            return false;
        }
        return chain.canDispense(amount);
    }
}
