package com.taskscheduler.observer;

import com.taskscheduler.ScheduledTask;

import java.time.LocalDateTime;

public class LoggingObserver implements  TaskExecutionObserver {

    @Override
    public void onTaskStarted(ScheduledTask task) {
        System.out.printf("[LOG - %s] [%s] Task %s started.%n", LocalDateTime.now(), Thread.currentThread().getName(), task.getId());
    }

    @Override
    public void onTaskCompleted(ScheduledTask task) {
        System.out.printf("[LOG - %s] [%s] Task %s completed successfully.%n", LocalDateTime.now(), Thread.currentThread().getName(), task.getId());
    }

    @Override
    public void onTaskFailed(ScheduledTask task, Exception e) {
        System.out.printf("[LOG - %s] [%s] Task %s failed %s%n", LocalDateTime.now(), Thread.currentThread().getName(), task.getId(), e.getMessage());
    }
}
