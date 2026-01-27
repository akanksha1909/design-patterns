import { SchedulingStrategy } from "./SchedulingStrategy";

export class OneTimeSchedulingStrategy implements SchedulingStrategy {
    private executionTime: Date;
    constructor(executionTime: Date) {
        this.executionTime = executionTime;
    }

    getNextExecutionTime(lastExecutionTime) {
        if (!lastExecutionTime) {
            return this.executionTime;
        }
        return null;
    }
}