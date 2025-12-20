package com.learnings.javathreads.exercise;

public class ExcerciseDemo {

    public void execute() {
        ThreadOne threadOne = new ThreadOne();
        Thread threadTwo = new Thread(new ThreadTwo());

        threadOne.start();
        threadTwo.start();

        try {
            Thread.sleep(2000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }

        threadOne.interrupt();
//        threadTwo.interrupt();
    }
}
