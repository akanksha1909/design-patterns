package com.splitwise.entities;

public class Transaction {
    private final User to;
    private final User from;
    private final double amount;

    public Transaction(User to, User from, double amount) {
        this.to = to;
        this.from = from;
        this.amount = amount;
    }

    @Override
    public String toString() {
        return from.getName() + " should pay " + to.getName() + " $" + String.format("%.2f", amount);
    }

}
