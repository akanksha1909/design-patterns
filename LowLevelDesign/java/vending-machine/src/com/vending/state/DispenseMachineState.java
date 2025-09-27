package com.vending.state;

import com.vending.VendingMachine;
import com.vending.VendingMachineDemo;
import com.vending.enums.Coin;

public class DispenseMachineState extends VendingMachineState {
    public DispenseMachineState(VendingMachine vendingMachine) {
        super(vendingMachine);
    }

    public void selectProduct(String productId){
      System.out.println("Product is ready to dispense!");
    }

    public void insertCoin(Coin coin){
        System.out.println("Product is ready to dispense!");
    }

    public void dispense(){
        this.vendingMachine.getInventory().dispenseProduct(this.vendingMachine.getSelectedProduct());
        this.vendingMachine.setState(new RefundState(this.vendingMachine));
    }

    public void refund(){
        System.out.println("No Refund Possible");
    }
}
