import { TaskExecutionObserver } from './TaskExecutionObserver.js';

/**
 * LoggingObserver - Logs task execution events
 */
export class LoggingObserver extends TaskExecutionObserver {
    onTaskStarted(task) {
        console.log(`[LOG - ${new Date().toISOString()}] Task ${task.getId()} started.`);
    }

    onTaskCompleted(task) {
        console.log(`[LOG - ${new Date().toISOString()}] Task ${task.getId()} completed successfully.`);
    }

    onTaskFailed(task, error) {
        console.log(`[LOG - ${new Date().toISOString()}] Task ${task.getId()} failed: ${error.message}`);
    }
}
