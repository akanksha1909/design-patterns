package com.taskscheduler;

import com.taskscheduler.strategy.OneTimeSchedulingStrategy;
import com.taskscheduler.strategy.RecurringTaskStrategy;
import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.PrintTaskStrategy;
import com.taskscheduler.task.Task;

import java.time.Duration;
import java.time.LocalDateTime;

public class Demo {
    public static void main(String[] args) throws InterruptedException {

        TaskSchedulingService scheduler = TaskSchedulingService.getInstance();
        scheduler.initialize(10);

        scheduler.startWorkers();
        // This
        SchedulingStrategy oneTimeStrategy = new OneTimeSchedulingStrategy(LocalDateTime.now().plusSeconds(5));
        Task oneTimeTask = new PrintTaskStrategy("This is a one time task");

        SchedulingStrategy recurringStrategy = new RecurringTaskStrategy(Duration.ofSeconds(5));
        Task recurringTask = new PrintTaskStrategy("This is a recurring task");

        System.out.println("Scheduling tasks....");
        scheduler.schedule(oneTimeTask, oneTimeStrategy);
        scheduler.schedule(recurringTask, recurringStrategy);

        System.out.println("Scheduler is running. Waiting for tasks to execute...(Demo will run for 15 seconds)");
        Thread.sleep(15000);

        scheduler.shutdown();
    }
}
