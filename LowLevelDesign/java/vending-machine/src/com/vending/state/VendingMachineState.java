package com.vending.state;

import com.vending.VendingMachine;
import com.vending.enums.Coin;

public abstract class VendingMachineState {
    VendingMachine vendingMachine;
    public VendingMachineState(VendingMachine vendingMachine) {
        this.vendingMachine = vendingMachine;
    }
    public abstract void selectProduct(String productId);
    public abstract void insertCoin(Coin coin);
    public abstract void dispense();
    public abstract void refund();
}
