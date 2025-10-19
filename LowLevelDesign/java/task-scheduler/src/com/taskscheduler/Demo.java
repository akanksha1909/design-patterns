package com.taskscheduler;

import com.taskscheduler.observer.LoggingObserver;
import com.taskscheduler.strategy.OneTimeSchedulingStrategy;
import com.taskscheduler.strategy.RecurringSchedulingStrategy;
import com.taskscheduler.strategy.SchedulingStrategy;
import com.taskscheduler.task.PrintMessageTask;
import com.taskscheduler.task.Task;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

public class Demo {
    public static void main(String[] args) throws InterruptedException {
        TaskSchedulerService scheduler = TaskSchedulerService.getInstance();
        scheduler.initialize(10);

        scheduler.addObserver(new LoggingObserver());

        // One time Task, 5 seconds from now
        Task oneTimeDelivery = new PrintMessageTask("This is a one time task");
        SchedulingStrategy oneTimeStrategy = new OneTimeSchedulingStrategy(LocalDateTime.now().plusSeconds(5));

        // Recurring task, every 5 seconds
        Task recurringTask = new PrintMessageTask("This is a recurring task");
        SchedulingStrategy recurringStrategy = new RecurringSchedulingStrategy(Duration.ofSeconds(5));


        // Schedule the tasks
        System.out.println("Scheduling tasks....");
        scheduler.schedule(oneTimeDelivery, oneTimeStrategy);
        scheduler.schedule(recurringTask, recurringStrategy);

        Thread.sleep(15000);

        scheduler.shutDown();


    }
}
