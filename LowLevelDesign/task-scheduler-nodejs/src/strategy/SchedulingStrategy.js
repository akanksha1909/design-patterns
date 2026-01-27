/**
 * SchedulingStrategy interface - defines how to calculate next execution time
 */
export class SchedulingStrategy {
    getNextExecutionTime(lastExecutionTime) {
        throw new Error("getNextExecutionTime() must be implemented by subclass");
    }
}
