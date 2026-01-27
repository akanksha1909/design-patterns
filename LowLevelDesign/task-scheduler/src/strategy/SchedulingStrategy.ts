export interface SchedulingStrategy {
    getNextExecutionTime(lastExecutionTime)
}