package com.vending.state;

import com.vending.VendingMachine;
import com.vending.enums.Coin;

public class IdleMachineState extends VendingMachineState {
    public IdleMachineState(VendingMachine vendingMachine) {
        super(vendingMachine);
    }
    public void selectProduct(String productId){
        boolean isAvailable = this.vendingMachine.getInventory().isAvailable(productId);
        if(!isAvailable) {
            System.out.print("Product is out of stock!");
            return;
        }
        this.vendingMachine.setSelectedProduct(productId);
        this.vendingMachine.setState(new ReadyMachineState(this.vendingMachine));
    }

    public void insertCoin(Coin coin){
        System.out.println("Please select a product first!");
    }

    public void dispense(){
        System.out.println("Please select a product first!");
    }
    public void refund(){
        System.out.println("No Refund Possible");
    }
}
