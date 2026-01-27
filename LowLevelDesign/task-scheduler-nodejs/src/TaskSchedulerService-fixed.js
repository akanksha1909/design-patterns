import { ScheduledTask } from './ScheduledTask.js';

/**
 * TaskSchedulerService - FIXED VERSION with proper synchronization
 * This version fixes the race condition in takeTask()
 */
export class TaskSchedulerService {
    static instance = null;

    constructor() {
        this.workers = [];
        this.isRunning = true;
        this.observers = [];
        this.taskQueue = [];
        this.pendingTakers = []; // Queue of workers waiting for tasks
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
                        console.log(`[WORKER ${workerId}] Task ${task.getId()} not ready yet, waiting ${waitTime}ms. Returning to queue.`);
                        this.offer(task);
                        await this.sleep(Math.min(waitTime, 100));
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
            scheduledTask.updateNextExecutionTime();
            if (scheduledTask.hasMoreExecutions()) {
                console.log(`${workerInfo} Rescheduling task ${scheduledTask.getId()} for ${scheduledTask.getNextExecutionTime()?.toISOString() || 'N/A'}`);
                this.offer(scheduledTask);
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
        // Wake up all waiting workers
        this.pendingTakers.forEach(resolve => resolve(null));
        this.pendingTakers = [];
        console.log("Scheduler shut down");
    }

    // FIXED: Thread-safe priority queue operations
    offer(task) {
        this.taskQueue.push(task);
        this.heapifyUp(this.taskQueue.length - 1);
        
        // If a worker is waiting, give them the highest priority task
        if (this.pendingTakers.length > 0 && this.taskQueue.length > 0) {
            const taker = this.pendingTakers.shift();
            const nextTask = this.removeTopTask();
            taker(nextTask);
        }
    }

    // FIXED: Thread-safe task retrieval
    async takeTask() {
        // If queue has tasks, return immediately (atomic operation)
        if (this.taskQueue.length > 0) {
            return this.removeTopTask();
        }
        
        // If queue is empty and scheduler stopped, throw error
        if (!this.isRunning) {
            throw new Error('Scheduler stopped');
        }
        
        // Otherwise, wait in line for a task
        return new Promise((resolve) => {
            this.pendingTakers.push(resolve);
        });
    }

    // Helper: Atomically remove and return the top task
    removeTopTask() {
        if (this.taskQueue.length === 0) return null;
        
        const task = this.taskQueue[0];
        if (this.taskQueue.length === 1) {
            this.taskQueue.pop();
            return task;
        }
        
        this.taskQueue[0] = this.taskQueue.pop();
        this.heapifyDown(0);
        return task;
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.taskQueue[index].compareTo(this.taskQueue[parentIndex]) >= 0) {
                break;
            }
            [this.taskQueue[index], this.taskQueue[parentIndex]] = 
                [this.taskQueue[parentIndex], this.taskQueue[index]];
            index = parentIndex;
        }
    }

    heapifyDown(index) {
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;

            if (left < this.taskQueue.length && 
                this.taskQueue[left].compareTo(this.taskQueue[smallest]) < 0) {
                smallest = left;
            }

            if (right < this.taskQueue.length && 
                this.taskQueue[right].compareTo(this.taskQueue[smallest]) < 0) {
                smallest = right;
            }

            if (smallest === index) break;

            [this.taskQueue[index], this.taskQueue[smallest]] = 
                [this.taskQueue[smallest], this.taskQueue[index]];
            index = smallest;
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
