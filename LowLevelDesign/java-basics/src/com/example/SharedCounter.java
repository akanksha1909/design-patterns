package com.example;

import java.util.concurrent.atomic.AtomicInteger;

public class SharedCounter implements Runnable {
    private AtomicInteger counter = new AtomicInteger(0);

//    Thread Name Worker-1 prints: 1
//    Thread Name Worker-1 prints: 3
//    Thread Name Worker-2 prints: 2
//    Thread Name Worker-1 prints: 4
//    Thread Name Worker-2 prints: 5
    @Override
    public void run() {
        while(true) {
            int value = counter.getAndIncrement();
            if (value > 4) break;
            System.out.println(" Thread Name " + Thread.currentThread().getName() + " prints: " + counter);
        }
    }
}
