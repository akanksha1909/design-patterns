import { randomUUID } from 'crypto';

/**
 * ScheduledTask - Wraps a Task with scheduling information
 * Implements comparison for priority queue ordering
 */
export class ScheduledTask {
    constructor(task, strategy) {
        this.id = randomUUID();
        this.task = task;
        this.strategy = strategy;
        this.nextExecutionTime = null;
        this.lastExecutionTime = null;
        this.updateNextExecutionTime();
    }

    updateNextExecutionTime() {
        this.nextExecutionTime = this.strategy.getNextExecutionTime(this.lastExecutionTime);
    }

    updateLastExecutionTime() {
        this.lastExecutionTime = this.nextExecutionTime;
    }

    getNextExecutionTime() {
        return this.nextExecutionTime;
    }

    getTask() {
        return this.task;
    }

    getId() {
        return this.id;
    }

    hasMoreExecutions() {
        return this.nextExecutionTime !== null && this.nextExecutionTime !== undefined;
    }

    // Comparison method for priority queue (earlier times have higher priority)
    compareTo(other) {
        if (!this.nextExecutionTime && !other.nextExecutionTime) return 0;
        if (!this.nextExecutionTime) return 1;
        if (!other.nextExecutionTime) return -1;
        return this.nextExecutionTime.getTime() - other.nextExecutionTime.getTime();
    }
}
