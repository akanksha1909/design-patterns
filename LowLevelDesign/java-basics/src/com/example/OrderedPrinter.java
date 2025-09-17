package com.example;

public class OrderedPrinter implements Runnable {
    private static final Object lock = new Object();
    private static int counter = 1;
    private final int threadId;
    private final int totalThreads;

    public OrderedPrinter(int threadId, int totalThreads){
        this.threadId = threadId;
        this.totalThreads = totalThreads;
    }

    public void run(){
        while(true){
            // synchronized(lock) → only one thread at a time can enter this block using the same lock object.
            synchronized (lock) {
                if(counter > 7) {
                    lock.notifyAll(); // Wake other threads to check if it is their turn
                    break;
                }

                // Check if it is thread's turn
                if(counter % totalThreads == threadId) {
                    System.out.println("Thread-" + (threadId) + " prints: " + counter);
                    counter += 1;
                    lock.notifyAll();
                } else {
                    try {
                        lock.wait(); // wait for turn
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                    }
                }
            }
        }
    }
}
