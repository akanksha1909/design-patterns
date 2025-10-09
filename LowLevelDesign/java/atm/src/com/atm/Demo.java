package com.atm;

import com.atm.enums.OperationType;

public class Demo {
    public static void main(String args[]) {
        AtmApplication service = AtmApplication.getInstance();

        // Check balance
//        service.insertCard("123455555");
//        service.enterPin("1234");
//        service.selectOperation(OperationType.CHECK_BALANCE);

        // Deposit amount
        service.insertCard("123455555");
        service.enterPin("1234");
        service.selectOperation(OperationType.DEPOSIT_CASH, 400);

        service.insertCard("123455555");
        service.enterPin("1234");
        service.selectOperation(OperationType.WITHDRAW_CASH, 1000);


    }
}
