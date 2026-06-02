package com.splitwise;

import com.splitwise.entities.Expense;
import com.splitwise.entities.Group;
import com.splitwise.entities.Transaction;
import com.splitwise.entities.User;
import com.splitwise.strategy.EqualSplitStrategy;
import com.splitwise.strategy.PercentageSplitStrategy;

import java.util.List;

public class Demo {
    public static void main(String[] args) {

//        Alice -> +550
//        Bob -> -400
//        Charlie -> -400
//        David -> +250
        SplitwiseApplication service = SplitwiseApplication.getInstance();
        User alice = service.addUser("Alice");
        User bob = service.addUser("Bob");
        User charlie = service.addUser("Charlie");
        User david = service.addUser("David");

        Group friendsGroup = service.createGroup("Friends", List.of(alice, bob, charlie, david));
        System.out.println("Equal Split Demo");
        service.createExpense(new Expense.ExpenseBuilder()
                .setDescription("Dinner")
                .setAmount(1000)
                .setPaidBy(alice)
                .setSplitStrategy(new EqualSplitStrategy())
                .setParticipants(List.of(alice, bob, charlie, david))
                );
        alice.getBalanceSheet().showBalanceSheet();
        bob.getBalanceSheet().showBalanceSheet();
        charlie.getBalanceSheet().showBalanceSheet();
        david.getBalanceSheet().showBalanceSheet();

        System.out.println("Split by percentage");
        service.createExpense(new Expense.ExpenseBuilder()
                .setDescription("Groceries")
                .setAmount(500)
                .setPaidBy(david)
                .setParticipants(List.of(alice, bob, charlie))
                .setSplitStrategy(new PercentageSplitStrategy())
                        .setSplitValues(List.of(40.0, 30.0, 30.0))
        );
        alice.getBalanceSheet().showBalanceSheet();
        bob.getBalanceSheet().showBalanceSheet();
        charlie.getBalanceSheet().showBalanceSheet();
        david.getBalanceSheet().showBalanceSheet();

        System.out.println("--- Use Case 4: Simplify Group Debts for 'Friends Trip' ---");
        List<Transaction> simplifiedDebts = service.simplifyGroupDebts(friendsGroup.getId());

        alice.getBalanceSheet().showBalanceSheet();
        bob.getBalanceSheet().showBalanceSheet();
        charlie.getBalanceSheet().showBalanceSheet();
        david.getBalanceSheet().showBalanceSheet();

        System.out.println("--- Use Case 5: Partial Settlement ---");
        // From the simplified debts, we see Bob should pay Alice. Let's say Bob pays 100.
        service.settleUp(bob.getId(), alice.getId(), 100);

        System.out.println("--- Balances After Partial Settlement ---");
        alice.getBalanceSheet().showBalanceSheet();
        bob.getBalanceSheet().showBalanceSheet();
    }
}
