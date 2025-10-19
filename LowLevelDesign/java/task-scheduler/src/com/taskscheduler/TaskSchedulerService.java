package com.taskscheduler;

import com.taskscheduler.observer.TaskExecutionObserver;
import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.Task;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.PriorityBlockingQueue;

public class TaskSchedulerService {
    private static TaskSchedulerService instance;
    private Thread[] workers;
    private volatile boolean isRunning=true;
    private final List<TaskExecutionObserver> observers = new ArrayList<>();
    private final PriorityBlockingQueue<ScheduledTask> taskQueue = new PriorityBlockingQueue<>();

    private TaskSchedulerService() {}

    public static TaskSchedulerService getInstance() {
        if(instance == null) {
            instance = new TaskSchedulerService();
        }
        return instance;
    }

    public void initialize(int workerCount) {
        workers = new Thread[workerCount];
        startWorkers();
    }

    private void startWorkers() {
        for(int i=0; i < workers.length; i++) {
            workers[i] = new Thread(this::runWorker, "WorkerThread-" + i);
            workers[i].setDaemon(true);
            workers[i].start();
        }
    }

    public void schedule(Task task, SchedulingStrategy strategy) {
        ScheduledTask scheduledTask = new ScheduledTask(task, strategy);
        taskQueue.put(scheduledTask);
    }

    private void runWorker() {
        while(isRunning) {
            try {
                ScheduledTask task = taskQueue.take(); // // waits here until an item is added
                LocalDateTime now = LocalDateTime.now();
                long waitTime = 0;
                if(task.getNextExecutionTime().isAfter(now)) {
                    waitTime = Duration.between(now, task.getNextExecutionTime()).toMillis();
                }
                // For 5 seconds from now, it is showing 4994
//                System.out.println(waitTime);

                if(waitTime > 0) {
                    // Wait for scheduled Time
                    Thread.sleep(waitTime);
                }
                execute(task);

            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }
    }

    private void execute(ScheduledTask task) {
        observers.forEach(o -> o.onTaskStarted(task));
        try {
            task.getTask().execute();
            task.updateLastExecutionTime();
            observers.forEach(o -> o.onTaskCompleted(task));
        } catch (Exception e) {
            System.err.printf("Task %s failed with error: %s%n", task.getId(), e.getMessage());
            observers.forEach(o -> o.onTaskFailed(task, e));
        } finally {
            // Rescheduling Logic
            task.updateNextExecutionTime();
            if(task.hasMoreExecutions()) {
                taskQueue.put(task); // Re-queue for the next run
            } else {
                System.out.printf("Task %s has no more executions and will not be rescheduled.%n", task.getId());
            }
        }
    }

    public void addObserver(TaskExecutionObserver observer) {
        observers.add(observer);
    }

    public void shutDown() {
        isRunning = false;
        for(Thread worker: workers) {
            worker.interrupt();
        }
        System.out.println("Scheduler shut down");
    }

}
