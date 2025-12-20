package com.learnings.producerconsumer;

import java.util.LinkedList;
import java.util.List;

public class MyBlockingQueue<T> {
    private final List<T> queue = new LinkedList<>();
    private final int capacity;

    public MyBlockingQueue(int capacity) {
        this.capacity = capacity;
    }

    public synchronized void put(T item) throws InterruptedException {
        while(queue.size() == capacity) {
            wait();
        }
        queue.add(item);
        System.out.println(Thread.currentThread().getName() + " produced: " + item);
        notifyAll();
    }

    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        T item = queue.remove(0);
        System.out.println(Thread.currentThread().getName() + " consumed: " + item);
        notifyAll(); // notify producers
        return item;
    }

}
