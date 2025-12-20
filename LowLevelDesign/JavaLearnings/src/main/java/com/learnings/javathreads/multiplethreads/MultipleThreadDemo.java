package com.learnings.javathreads.multiplethreads;

import com.learnings.javathreads.ThreadDemo;

import java.util.concurrent.TimeUnit;

public class MultipleThreadDemo {

    public void execute() {
        StopWatch stopWatch = new StopWatch(TimeUnit.SECONDS);
        Thread green = new Thread(stopWatch::countDown, ThreadColor.ANSI_GREEN.name());
        green.start();
        Thread purple = new Thread(() -> stopWatch.countDown(7), ThreadColor.ANSI_PURPLE.name());
        purple.start();
    }


}

class StopWatch {
    private TimeUnit timeUnit;

    StopWatch(TimeUnit timeUnit) {
        this.timeUnit = timeUnit;
    }

    void countDown() {
        countDown(5);
    }

    void countDown(int unitCount) {
        String threadName = Thread.currentThread().getName();
        for(int i=0; i <= unitCount; i++) {
            try {
                timeUnit.sleep(1);
            } catch(InterruptedException e) {
                e.printStackTrace();
            }
            System.out.printf("%s%s Thread: i = %d%n", ThreadColor.valueOf(threadName).color(), threadName, i);
        }
    }

}
