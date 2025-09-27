package com.vending;

import com.vending.enums.Coin;

public class VendingMachineDemo {
    public static void main(String args[]) {
        VendingMachine vendingMachineService = VendingMachine.getInstance();
        String appleId = vendingMachineService.addProduct("Apple", 20, 2);
        vendingMachineService.selectProduct(appleId);
        vendingMachineService.insertCoin(Coin.NICKEL);
        vendingMachineService.insertCoin(Coin.QUARTER);
        vendingMachineService.dispense();
        vendingMachineService.refund();
    }
}
