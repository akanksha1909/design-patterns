package com.learnings.javathreads.synchronizationEx;

public class SyncDemo {

    public void execute() {
        BankAccount bankAccount = new BankAccount("Tom", 10000);

        Thread thread1 = new Thread(() -> bankAccount.withdraw(2500));
        Thread thread2 = new Thread(() -> bankAccount.deposit(5000));
        Thread thread3 = new Thread(() -> bankAccount.setName("Akanksha"));
        Thread thread4 = new Thread(() -> bankAccount.withdraw(5000));


        thread1.start();
        thread2.start();

        try {
            Thread.sleep(500);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
        thread3.start();
        thread4.start();

        try {
            thread1.join();
            thread2.join();
            thread3.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("FINAL BALANCE " + bankAccount.getBalance());

    }
}
