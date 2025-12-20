package com.learnings.javathreads.synchronizationEx;

public class BankAccount {

    private double balance;
    private String name;
    public BankAccount(String name, double balance) {
        this.balance = balance;
        this.name = name;
    }

    public double getBalance() {
        return balance;
    }

    public void setName(String name) {
        // We are not blocking the whole this instance, just taking a lock on name
        synchronized (this.name) {
            this.name = name;
            System.out.println("Updated name = " + this.name);
        }

    }

    public String getName() {
        return this.name;
    }

    public synchronized void deposit(double amount) {
        try {
            System.out.println("Deposit - Talking to the teller at the bank ...");
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
//        synchronized (this) {
            double originalBalance = balance;
            balance += amount;
            System.out.printf("Starting balance %.0f, DEPOSIT(%.0f), NEW BALANCE = %.0f%n", originalBalance, amount, balance);
//        }

    }

    public synchronized void withdraw(double amount) {
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        double originalBalance = balance;
        if(amount <= balance) {
            balance -= amount;
            System.out.printf("Starting balance %.0f, WITHDRAW(%.0f), NEW BALANCE = %.0f%n", originalBalance, amount, balance);
        } else {
            System.out.printf("Starting balance %.0f, WITHDRAW(%.0f), INSUFFICIENT FUNDS!", originalBalance, amount);
        }

    }
}
