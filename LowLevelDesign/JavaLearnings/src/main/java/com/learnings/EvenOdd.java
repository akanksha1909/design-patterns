package com.learnings;

public class EvenOdd {
    private int number = 1;
    private final Integer limit;
    public EvenOdd(Integer limit) {
        this.limit = limit;
    }

    public void execute() {
        Thread evenThread = new Thread(() -> {try {
            printEven();
        } catch(InterruptedException e) {
        }
        });
        Thread oddThread = new Thread(() -> {
            try {
                printOdd();
            } catch(InterruptedException e) {

            }
        });

        evenThread.start();
        oddThread.start();
    }

    public synchronized void printEven() throws InterruptedException{
        while(number <= limit) {
            while(number%2 != 0) {
                wait();
            }
            if(number > limit) {
                notify();
                break;
            }
            System.out.println("Printing Even number " + number);
            number += 1;
            notify();
        }
    }

    public synchronized void printOdd() throws InterruptedException{
        while(number <= limit) {
            while(number%2 == 0) {
                wait();
            }
            if(number > limit) {
                notify();
                break;
            }
            System.out.println("Printing Odd number " + number);
            number += 1;
            notify();
        }
    }
}
