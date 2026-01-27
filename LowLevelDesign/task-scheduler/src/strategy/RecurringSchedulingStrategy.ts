export class RecurringSchedulingStrategy {
    private intervalInMs: number;
    constructor(intervalInMs) {
        this.intervalInMs = intervalInMs;
    }

    getNextExecutionTime(lastExecutionTime){
        let baseTime = new Date()
        if(lastExecutionTime) {
            baseTime = lastExecutionTime
        }
        return new Date(baseTime.getTime() + this.intervalInMs)
    }

}