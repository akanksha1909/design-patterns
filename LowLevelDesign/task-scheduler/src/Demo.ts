import { OneTimeSchedulingStrategy } from "./strategy/OneTimeSchedulingStrategy"
import { RecurringSchedulingStrategy } from "./strategy/RecurringSchedulingStrategy"
import { PrintMessage } from "./task/PrintMessage"
import { TaskSchedulerService } from "./TaskSchedulerService"

class Demo {
    async run() {
        const taskSchedulerService = TaskSchedulerService.getInstance()
        taskSchedulerService.initialise(10)

        const printTask = new PrintMessage("This is a print message task")
        const oneTimeScheduleStrategy = new OneTimeSchedulingStrategy(new Date(Date.now() + 5000)) // 5s from now
        taskSchedulerService.schedule(printTask, oneTimeScheduleStrategy)

        const repeatPrintTask = new PrintMessage("This is a repeated print message task");
        const recurringScheduleStrategy = new RecurringSchedulingStrategy(5000);

        taskSchedulerService.schedule(repeatPrintTask, recurringScheduleStrategy);

        console.log("Scheduler is running. Waiting for tasks to execute...(Demo will run for 15 seconds)");

        // Wait for 15 seconds
        await new Promise(resolve => setTimeout(resolve, 15000));

        taskSchedulerService.shutDown();
        process.exit(0);
    }
}

new Demo().run()