package com.taskscheduler;

import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.Task;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.PriorityBlockingQueue;

public class TaskSchedulingService {

    private static TaskSchedulingService instance;
    private Thread[] workers;
    private boolean isRunning = true;
    private PriorityBlockingQueue<ScheduledTask> queue = new PriorityBlockingQueue<>();

    private TaskSchedulingService() {

    }
    public static TaskSchedulingService getInstance() {
        if(instance == null) {
            TaskSchedulingService.instance = new TaskSchedulingService();
        }
        return instance;
    }

    public void initialize(int count) {
        workers = new Thread[count];
        startWorkers();
    }

    public void startWorkers() {
        for(int i=0;i< workers.length;i++) {
            workers[i] = new Thread(this::run, "Worker-Thread " + i);
            // This
            workers[i].setDaemon(true);
            workers[i].start();
        }
    }

    public void schedule(Task task, SchedulingStrategy strategy) {
        ScheduledTask scheduledTask = new ScheduledTask(task, strategy);
        queue.put(scheduledTask);
    }


    private void run() {
        while(isRunning) {
            try {
                ScheduledTask task = queue.take();
                LocalDateTime now = LocalDateTime.now();
                long waitTime = 0;
                if(task.getNextExecutionTime().isAfter(now)) {
                    // This
                    waitTime = Duration.between(now, task.getNextExecutionTime()).toMillis();
                }
                if(waitTime > 0) {
                    queue.put(task);
                    Thread.sleep(waitTime);
                    continue;
                }
                execute(task);

            } catch(InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }

        }
    }

    private void execute(ScheduledTask task) {
        try {
            task.getTask().execute();
            task.updateLastExecutionTime();
        } catch(RuntimeException e) {

        } finally {
            task.updateNextExecutionTime();
            if(task.hasMoreExecutions()) {
                queue.put(task);
            } else {
                System.out.printf("Task %s has no more executions and will not be rescheduled.%n", task.getId());
            }
        }
    }

    public void shutdown() {
        isRunning = false;
        for(Thread worker: workers) {
            worker.interrupt();
        }

        System.out.println("Scheduler ShutDown");
    }

}
