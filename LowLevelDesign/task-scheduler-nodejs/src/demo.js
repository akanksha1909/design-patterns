import { TaskSchedulerService } from './TaskSchedulerService.js';
import { LoggingObserver } from './observer/LoggingObserver.js';
import { OneTimeSchedulingStrategy } from './strategy/OneTimeSchedulingStrategy.js';
import { RecurringSchedulingStrategy } from './strategy/RecurringSchedulingStrategy.js';
import { PrintMessageTask } from './task/PrintMessageTask.js';

/**
 * Demo - Example usage of the Task Scheduler
 */
async function main() {
    const scheduler = TaskSchedulerService.getInstance();
    scheduler.initialize(10);

    scheduler.addObserver(new LoggingObserver());

    // One time Task, 5 seconds from now
    const oneTimeDelivery = new PrintMessageTask("This is a one time task");
    const oneTimeStrategy = new OneTimeSchedulingStrategy(
        new Date(Date.now() + 5000)
    );

    // Recurring task, every 5 seconds
    const recurringTask = new PrintMessageTask("This is a recurring task");
    const recurringStrategy = new RecurringSchedulingStrategy(5000); // 5000ms = 5 seconds

    // Schedule the tasks
    console.log("Scheduling tasks....");
    scheduler.schedule(oneTimeDelivery, oneTimeStrategy);
    scheduler.schedule(recurringTask, recurringStrategy);

    console.log("Scheduler is running. Waiting for tasks to execute...(Demo will run for 15 seconds)");
    
    // Wait for 15 seconds
    await new Promise(resolve => setTimeout(resolve, 15000));

    scheduler.shutDown();
    process.exit(0);
}

main().catch(console.error);
