import { MinHeap } from "@datastructures-js/heap";
import { SchedulingStrategy } from "./strategy/SchedulingStrategy";
import { Task } from "./task/Task";
import { ScheduledTask } from "./ScheduledTask";

export class TaskSchedulerService {
    private static _instance: TaskSchedulerService;
    private workers: Promise<void>[];

    private isRunning: boolean;
    private taskQueue: MinHeap<ScheduledTask>;


    private constructor() {
        this.workers = []
        this.isRunning = true;
        // @ts-ignore
        this.taskQueue = new MinHeap((a, b) => a.compareTo(b));
    }

    static getInstance(): TaskSchedulerService {
        if (!this._instance) {
            this._instance = new TaskSchedulerService();
        }
        return this._instance;
    }

    initialise(workersCount) {
        for (let i = 0; i < workersCount; i++) {
            this._startWorker(i)
        }
    }

    _startWorker(workerId: number) {
        const worker = async (): Promise<void> => {
            while (this.isRunning) {
                // Important: This line is very very important
                const nextTask = this.taskQueue.root();
                if (!nextTask) {
                    // No tasks in queue, wait a bit before checking again
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                }

                // Currently this task is picked by all the workers
                // console.log(`[WORKER ${workerId}] Picked task ${nextTask.getScheduledTaskId()} from queue (scheduled for ${nextTask.getNextExecutionTime()?.toISOString() || 'N/A'})`);
                const now = new Date();
                const waitTime = nextTask.getNextExecutionTime()
                    ? Math.max(0, nextTask.getNextExecutionTime().getTime() - now.getTime())
                    : 0;
                if (waitTime > 0) {
                    // Task not ready yet, wait before checking again
                    await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 100)));
                } else {
                    // Task is ready, extract and execute
                    this.taskQueue.extractRoot();
                    this._execute(nextTask);
                }
            }
        }
        this.workers.push(worker())
    }

    schedule(task: Task, taskSchedulingStrategy: SchedulingStrategy) {
        const scheduledTask = new ScheduledTask(task, taskSchedulingStrategy);
        this.taskQueue.insert(scheduledTask);
    }

    _execute(scheduledTask: ScheduledTask) {
        try {
            scheduledTask.getTask().execute();
            scheduledTask.updateLastExecutionTime();
            console.log(`Task ${scheduledTask.getScheduledTaskId()} execution completed successfully`);
        } catch (error) {
            console.error(`Task ${scheduledTask.getScheduledTaskId()} failed with error: ${error.message}`);
        } finally {
            scheduledTask.updateNextExecutionTime();
            if (scheduledTask.hasMoreExecutions()) {
                this.taskQueue.insert(scheduledTask)
            } else {
                console.log(`Task: ${scheduledTask.getScheduledTaskId()} has no more executions to run.`)
            }
        }
    }

    shutDown() {
        this.isRunning = false;
        console.log("Scheduler shut down");
    }
}