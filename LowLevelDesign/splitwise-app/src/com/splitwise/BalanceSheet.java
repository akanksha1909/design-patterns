package com.splitwise;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class BalanceSheet {
    private final User owner;
    // ConcurrentHashMap<K,V> is a thread-safe implementation of Map in Java (java.util.concurrent package).
    private final Map<User, Double> balances = new ConcurrentHashMap<>();
    public BalanceSheet(User owner){
        this.owner = owner;
    }

    public synchronized void adjustBalance(User otherUser, double amount) {
        if(owner.equals(otherUser)) {
            return; // Can't owe yourself
        }
        balances.merge(otherUser, amount, Double::sum);
    }

    public void showBalances(){
        System.out.println("----Balance Sheet for " + this.owner.getName() + "----");
        double totalOwedToMe = 0;
        double totalIOwe = 0;
        for(Map.Entry<User, Double> entry: balances.entrySet()) {
            User otherUser = entry.getKey();
            double amount = entry.getValue();
            if(amount > 0.01) {
                System.out.println(otherUser.getName() + " owes " + owner.getName() + " amount of " + amount);
                totalOwedToMe += amount;
            } else if(amount < -0.01) {
                totalIOwe += (-amount);
                System.out.println(owner.getName() + " owes " + otherUser.getName() + " amount of " + amount);
            }
        }
        System.out.println("Total Owed amount " + totalOwedToMe);
        System.out.println("Total I Owe " + totalIOwe);
    }
}
