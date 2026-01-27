import { SchedulingStrategy } from "./strategy/SchedulingStrategy";
import { Task } from "./task/Task";
import { randomUUID } from 'node:crypto';

export class ScheduledTask {
    private taskId: string;
    private task: Task;
    private schedulingStrategy: SchedulingStrategy;
    private nextExecutionTime: Date;
    private lastExecutionTime: Date;

    constructor(task: Task, schedulingStrategy: SchedulingStrategy) {
        this.taskId = randomUUID();
        this.task = task;
        this.schedulingStrategy = schedulingStrategy;
        this.lastExecutionTime = null;
        this.nextExecutionTime = this.schedulingStrategy.getNextExecutionTime(this.lastExecutionTime);
    }

    getScheduledTaskId() {
        return this.taskId;
    }

    getNextExecutionTime() {
        return this.nextExecutionTime;
    }

    getLastExecutionTime() {
        return this.lastExecutionTime;
    }

    updateLastExecutionTime() {
        this.lastExecutionTime = this.nextExecutionTime;
    }

    updateNextExecutionTime() {
        this.nextExecutionTime = this.schedulingStrategy.getNextExecutionTime(this.lastExecutionTime)
    }

    getTask() {
        return this.task;
    }

    hasMoreExecutions() {
        return this.nextExecutionTime != null;
    }

    compareTo(other) {
        if (!other) return -1;

        const thisTime = this.getNextExecutionTime();
        const otherTime = other.getNextExecutionTime();

        if (!thisTime && !otherTime) return 0;
        if (!thisTime) return -1;
        if (!otherTime) return 1;

        return thisTime.getTime() - otherTime.getTime();
    }
}