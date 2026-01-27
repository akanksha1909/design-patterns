/**
 * TaskExecutionObserver interface - defines callbacks for task lifecycle events
 */
export class TaskExecutionObserver {
    onTaskStarted(task) {
        throw new Error("onTaskStarted() must be implemented by subclass");
    }

    onTaskCompleted(task) {
        throw new Error("onTaskCompleted() must be implemented by subclass");
    }

    onTaskFailed(task, error) {
        throw new Error("onTaskFailed() must be implemented by subclass");
    }
}
