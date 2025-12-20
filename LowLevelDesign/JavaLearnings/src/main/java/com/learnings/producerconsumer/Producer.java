package com.learnings.producerconsumer;

public class Producer implements Runnable {
    private final MyBlockingQueue<Integer> queue;
    private int counter = 1;

    public Producer(MyBlockingQueue<Integer> queue) {
        this.queue = queue;
    }

    public void run() {
        try {
            while (true) {
                queue.put(counter++);
                Thread.sleep(300);
            }
        } catch(InterruptedException e) {
            e.printStackTrace();
        }
    }

}
