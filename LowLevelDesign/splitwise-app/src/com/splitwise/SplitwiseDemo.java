package com.splitwise;

import com.splitwise.strategy.EqualSplitStrategy;
import java.util.List;

public class SplitwiseDemo {
    public static void main(String [] args) {
        SplitwiseApplication service = SplitwiseApplication.getInstance();
        User alice = service.createUser("Alice", "alice@gmail.com");
        User bob = service.createUser("Bob", "bob@gmail.com");
        User charlie = service.createUser("charlie", "charlie@gmail.com");

        Group friendsGroup = service.createGroup("Friends Trip", List.of(alice, bob, charlie));

        System.out.println("System Setup Complete");

        // Usecase 1: Equal Split
        System.out.println("-----Usecase 1: Equal Split-------");
        service.createExpense(new Expense.ExpenseBuilder()
                .setDescription("Dinner")
                .setAmount(1000)
                .setPaidBy(alice)
                .setParticipants(List.of(alice, bob, charlie))
                .setSplitStrategy(new EqualSplitStrategy()));
        service.showBalanceSheet(alice.getId());
        service.showBalanceSheet(bob.getId());
    }
}
