package com.learnings.javathreads.exercise.producerconsumerchallenge;

import java.util.Random;

class Producer implements Runnable {
    private final ShoeWarehouse shoeWarehouse;
    public Producer(ShoeWarehouse shoeWarehouse) {
        this.shoeWarehouse = shoeWarehouse;
    }

    public void run() {
        Random random = new Random();
        for(int i=0;i<10;i++) {
            shoeWarehouse.receiveOrder(
                    new Order(ShoeWarehouse.PRODUCT_LIST[random.nextInt(0, 5)],
                            random.nextInt(1, 4))
            );
        }
    }
}

class Consumer implements Runnable {
    private final ShoeWarehouse shoeWarehouse;
    public Consumer(ShoeWarehouse shoeWarehouse) {
        this.shoeWarehouse = shoeWarehouse;
    }

    public void run() {
        for(int i=0; i< 5;i++) {
            shoeWarehouse.fulfillOrder();
        }
    }
}

public class DemoClass {

    public void execute() {

        ShoeWarehouse shoeWarehouse = new ShoeWarehouse();
        Thread producerThread = new Thread(new Producer(shoeWarehouse));
        Thread consumerThread1 = new Thread(new Consumer(shoeWarehouse));
        Thread consumerThread2 = new Thread(new Consumer(shoeWarehouse));

        producerThread.start();
        consumerThread1.start();
        consumerThread2.start();
    }
}
