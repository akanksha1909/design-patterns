package com.learnings.producerconsumer;

public class Consumer implements Runnable {
    private final MyBlockingQueue<Integer> queue;

    public Consumer(MyBlockingQueue<Integer> queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            while (true) {
                queue.take();
                Thread.sleep(500);
            }
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
    }

}
