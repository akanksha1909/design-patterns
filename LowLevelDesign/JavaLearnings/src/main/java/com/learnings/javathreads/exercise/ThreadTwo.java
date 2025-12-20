package com.learnings.javathreads.exercise;

public class ThreadTwo implements Runnable {

    @Override
    public void run() {
        for(int i=1;i<=10;i++) {
            if(i%2 != 0){
                System.out.println("Printing odd number " + i);
            }
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
                System.out.println("Odd thread got interrupted");
            }
        }
    }
}
