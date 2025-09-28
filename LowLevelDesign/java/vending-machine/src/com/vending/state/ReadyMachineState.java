package com.vending.state;

import com.vending.VendingMachine;
import com.vending.enums.Coin;

public class ReadyMachineState extends VendingMachineState {
    public ReadyMachineState(VendingMachine vendingMachine) {
        super(vendingMachine);
    }

    @Override
    public void selectProduct(String productId) {
        System.out.println("Product is already selected!");
    }

    @Override
    public void insertCoin(Coin coin) {
        this.vendingMachine.addCoin(coin);
        if(this.vendingMachine.getPayment() >= this.vendingMachine.getSelectedProduct().getPrice()) {
            this.vendingMachine.setState(new DispenseMachineState(this.vendingMachine));
        }
    }

    public void dispense(){
        System.out.println("Please insert coins first!");
    }
    public void refund(){
        System.out.println("No Refund Possible");
    }
}
