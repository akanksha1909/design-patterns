package com.learnings.javathreads;

public class RunningThread {

    public void execute() {
        System.out.println("Main Thread is running");
        try {
            System.out.println("Main Thread paused for one second");
            Thread.sleep(1000);
        } catch(InterruptedException e) {
            e.printStackTrace();
        }

        Thread thread = new Thread(() -> {
            String tname = Thread.currentThread().getName();
            System.out.println(tname + " should take 10 dots to run.");
            for(int i=0; i < 10; i++) {
                System.out.print(". ");
                try {
                    Thread.sleep(500);
//                    System.out.println("A. State = " + Thread.currentThread().getState());
                } catch(InterruptedException e) {
                    System.out.println("\nWhoops!! " + tname + " interrupted");
//                    System.out.println("A1. State = " + Thread.currentThread().getState());
                    return;
                }
            }
            System.out.println("\n" + tname + " completed");
        });

        Thread installThread = new Thread(() -> {
            try {
                for(int i = 0; i < 3; i++) {
                    Thread.sleep(250);
                    System.out.println("Installation Step " + ( i + 1) + " is completed");
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "InstallThread");

        System.out.println(thread.getName() + " starting");
        thread.start();

        long now = System.currentTimeMillis();
        while(thread.isAlive()) {
            System.out.println("\nwaiting for thread to complete");
            try {
                Thread.sleep(1000);
//                System.out.println("B. State = " + thread.getState());
                if(System.currentTimeMillis() - now > 2000) {
                    thread.interrupt();
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }

        try {
            thread.join(); // Main thread, stop here and wait until this thread is done.
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }

        if(!thread.isInterrupted()) {
            installThread.start();
        } else {
            System.out.println("Previous Thread was interrupted, " + installThread.getName() + " can't run.");
        }

//        System.out.println("C. State = " + thread.getState());

//        System.out.println("Main Thread would continue here...");

//        try {
//            Thread.sleep(2000);
//        } catch (InterruptedException e) {
//            e.printStackTrace();
//        }
//
//        thread.interrupt();

    }
}
