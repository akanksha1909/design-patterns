package com.learnings.javathreads;

import java.util.concurrent.TimeUnit;

public class ThreadDemo {

    public void execute() {
        var currentThread = Thread.currentThread();
        System.out.println(currentThread.getClass().getName()); // java.lang.Thread
        System.out.println(currentThread);
        printThreadState(currentThread);
        currentThread.setName("Main guy");

        // Higher priority tasks have a better chance of being scheduled over the
        // lower priority threads
        currentThread.setPriority(Thread.MAX_PRIORITY);
        printThreadState(currentThread);

        CustomThread customThread = new CustomThread();
        customThread.start();
        // If we call customThread.run(), it will run the code synchronously.

        Runnable myRunnable = () -> {
            for(int i=0; i<3;i++) {
                System.out.print(" 2 ");
                try {
                    TimeUnit.SECONDS.sleep(1);
                } catch(InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        Thread myThread = new Thread(myRunnable);
        myThread.start();

        for(int i=0; i<6;i++) {
            System.out.print(" 0 ");
            try {
                TimeUnit.SECONDS.sleep(1);
            } catch(InterruptedException e) {
                e.printStackTrace();
            }
        }

        // Output:   1  0  2  1  0  2  1  1  0  2  1  0  0  0
        // All of the three threads are running and executing
    }

    public static void printThreadState(Thread thread) {
        System.out.println("----------------------");
        System.out.println("Thread ID: " + thread.getId());
        System.out.println("Thread Name: " + thread.getName());
        System.out.println("Thread Priority: " + thread.getPriority());
        System.out.println("Thread State: " + thread.getState());
        System.out.println("Thread Group: " + thread.getThreadGroup());

    }
}
