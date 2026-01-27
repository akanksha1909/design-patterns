import { SchedulingStrategy } from './SchedulingStrategy.js';

/**
 * OneTimeSchedulingStrategy - Executes a task once at a specific time
 */
export class OneTimeSchedulingStrategy extends SchedulingStrategy {
    constructor(executionTime) {
        super();
        this.executionTime = executionTime;
    }

    getNextExecutionTime(lastExecutionTime) {
        // If lastExecutionTime is null, it's the first run. Otherwise it is done.
        // Return null to indicate no more executions
        return (lastExecutionTime === null || lastExecutionTime === undefined) 
            ? this.executionTime 
            : null;
    }
}
