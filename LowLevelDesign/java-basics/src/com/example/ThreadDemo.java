package com.example;

public class ThreadDemo implements Runnable {
    private final String taskname;

    public ThreadDemo(String taskname) {
        this.taskname = taskname;
    }

    public void run(){
        for(int i=1;i<3;i++) {
            // Here each thread has its own i counter inside run()
            System.out.println(this.taskname + " - Count: " + i + " (Thread: " + Thread.currentThread().getName() + ")");
            try {
                Thread.sleep(500); // simulate work
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }
}
