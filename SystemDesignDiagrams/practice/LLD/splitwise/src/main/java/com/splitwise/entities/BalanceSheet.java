package com.splitwise.entities;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class BalanceSheet {
    private final User owner;
    private final Map<User, Double> balances = new ConcurrentHashMap<>();
    // A map where:
    // Key: The user to whom the balance is related.
    // Value: The net amount.
    // - Positive value: The key-user owes the owner of this balance sheet money.
    // - Negative value: The owner owes the key-user money.
    public BalanceSheet(User owner) {
        this.owner = owner;
    }

    public Map<User, Double> getBalances() {
        return this.balances;
    }

    public synchronized void adjustBalance(User otherUser, double amount) {
        balances.merge(otherUser, amount, Double::sum);
    }

    public void showBalanceSheet() {
        double totalOwedToMe = 0;
        double totalIOwe = 0;
        for(Map.Entry<User, Double> entry: balances.entrySet()) {
            User otherUser = entry.getKey();
            double amount = entry.getValue();
            if(entry.getValue() > 0.01) {
//                System.out.println(otherUser.getName() + " owes " + owner.getName() + " $" + String.format("%.2f", amount));
                totalOwedToMe += entry.getValue();
            } else if (entry.getValue() < -0.01){
//                System.out.println(owner.getName() + " owes " + otherUser.getName() + " $" + String.format("%.2f", -amount));
                totalIOwe += (-entry.getValue());
            }
        }
        System.out.println("Balance sheet of user " + owner.getName());
        System.out.printf("Total amount Owed to me %.0f%n", totalOwedToMe);
        System.out.printf("Total amount I Owe %.0f%n", totalIOwe);
        System.out.println("-----------------------------------------");
    }
}
