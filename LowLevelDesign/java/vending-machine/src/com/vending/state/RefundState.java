package com.vending.state;

import com.vending.VendingMachine;
import com.vending.VendingMachineDemo;
import com.vending.enums.Coin;

public class RefundState extends VendingMachineState {
    public RefundState(VendingMachine vendingMachine) {
        super(vendingMachine);
    }

    public void selectProduct(String productId){
        System.out.println("Product is ready to dispense!");
    }

    public void insertCoin(Coin coin){
        System.out.println("Product is ready to dispense!");
    }

    public void dispense(){
        System.out.println("Product is ready to dispense!");
    }

    public void refund(){
        Integer change = this.vendingMachine.getPayment() - this.vendingMachine.getSelectedProduct().getPrice();
        if(change > 0) {
            System.out.println("Please collect your change " + change);
        }
        this.vendingMachine.setSelectedProduct(null);
        this.vendingMachine.setPayment(0);
        this.vendingMachine.setState(new IdleMachineState(this.vendingMachine));
    }
}
