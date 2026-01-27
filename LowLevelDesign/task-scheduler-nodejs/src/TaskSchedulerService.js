import { ScheduledTask } from './ScheduledTask.js';
import { MinHeap } from '@datastructures-js/heap';

/**
 * TaskSchedulerService - Singleton service that manages task scheduling and execution
 * Uses a priority queue to manage scheduled tasks and async worker functions for execution
 * Note: These are async functions (not Node.js Worker threads) - they run concurrently on the same event loop
 */
export class TaskSchedulerService {
    static instance = null;

    constructor() {
        this.workers = [];
        this.isRunning = true;
        this.observers = [];
        // MinHeap with comparator function that uses ScheduledTask's compareTo method
        this.taskQueue = new MinHeap((a, b) => a.compareTo(b));
    }

    static getInstance() {
        if (TaskSchedulerService.instance === null) {
            TaskSchedulerService.instance = new TaskSchedulerService();
        }
        return TaskSchedulerService.instance;
    }

    initialize(workerCount) {
        this.workers = [];
        for (let i = 0; i < workerCount; i++) {
            this.startWorker(i);
        }
    }

    startWorker(workerId) {
        const worker = async () => {
            while (this.isRunning) {
                try {
                    const task = await this.takeTask();
                    if (!task) continue;

                    console.log(`[WORKER ${workerId}] Picked task ${task.getId()} from queue (scheduled for ${task.getNextExecutionTime()?.toISOString() || 'N/A'})`);

                    const now = new Date();
                    const waitTime = task.getNextExecutionTime() 
                        ? Math.max(0, task.getNextExecutionTime().getTime() - now.getTime())
                        : 0;

                    if (waitTime > 0) {
                        // Put task back and wait
                        console.log(`[WORKER ${workerId}] Task ${task.getId()} not ready yet, waiting ${waitTime}ms. Returning to queue.`);
                        this.offer(task);
                        await this.sleep(Math.min(waitTime, 100)); // Short sleep to avoid blocking
                        continue;
                    }

                    console.log(`[WORKER ${workerId}] Executing task ${task.getId()} now`);
                    await this.execute(task, workerId);
                } catch (error) {
                    if (error.message !== 'Scheduler stopped') {
                        console.error(`Worker ${workerId} error:`, error);
                    }
                    break;
                }
            }
        };
        this.workers.push(worker());
    }

    schedule(task, strategy) {
        const scheduledTask = new ScheduledTask(task, strategy);
        console.log(`[MAIN PROCESS] Scheduling task ${scheduledTask.getId()} for execution at ${scheduledTask.getNextExecutionTime()?.toISOString() || 'N/A'}`);
        this.offer(scheduledTask);
    }

    async execute(scheduledTask, workerId = null) {
        const workerInfo = workerId !== null ? `[WORKER ${workerId}]` : '[MAIN PROCESS]';
        console.log(`${workerInfo} Starting execution of task ${scheduledTask.getId()}`);
        
        // Notify observers
        this.observers.forEach(observer => observer.onTaskStarted(scheduledTask));

        try {
            await scheduledTask.getTask().execute();
            scheduledTask.updateLastExecutionTime();
            console.log(`${workerInfo} Task ${scheduledTask.getId()} execution completed successfully`);
            this.observers.forEach(observer => observer.onTaskCompleted(scheduledTask));
        } catch (error) {
            console.error(`${workerInfo} Task ${scheduledTask.getId()} failed with error: ${error.message}`);
            this.observers.forEach(observer => observer.onTaskFailed(scheduledTask, error));
        } finally {
            // Rescheduling Logic
            scheduledTask.updateNextExecutionTime();
            if (scheduledTask.hasMoreExecutions()) {
                console.log(`${workerInfo} Rescheduling task ${scheduledTask.getId()} for ${scheduledTask.getNextExecutionTime()?.toISOString() || 'N/A'}`);
                this.offer(scheduledTask); // Re-queue for the next run
            } else {
                console.log(`${workerInfo} Task ${scheduledTask.getId()} has no more executions and will not be rescheduled.`);
            }
        }
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    shutDown() {
        this.isRunning = false;
        console.log("Scheduler shut down");
    }

    // Priority Queue Operations (Min Heap using @datastructures-js/heap)
    offer(task) {
        this.taskQueue.insert(task);
    }

    async takeTask() {
        while (this.isRunning && this.taskQueue.size() === 0) {
            await this.sleep(10); // Wait for tasks
        }

        if (!this.isRunning && this.taskQueue.size() === 0) {
            throw new Error('Scheduler stopped');
        }

        if (this.taskQueue.size() === 0) return null;

        // Extract and return the minimum (highest priority) task
        return this.taskQueue.extractRoot();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
