import { SchedulingStrategy } from './SchedulingStrategy.js';

/**
 * RecurringSchedulingStrategy - Executes a task repeatedly at specified intervals
 */
export class RecurringSchedulingStrategy extends SchedulingStrategy {
    constructor(intervalMs) {
        super();
        this.intervalMs = intervalMs; // interval in milliseconds
    }

    getNextExecutionTime(lastExecutionTime) {
        const baseTime = (lastExecutionTime === null || lastExecutionTime === undefined) 
            ? new Date() 
            : lastExecutionTime;
        return new Date(baseTime.getTime() + this.intervalMs);
    }
}
