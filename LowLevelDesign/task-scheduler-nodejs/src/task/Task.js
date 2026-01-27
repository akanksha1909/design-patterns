/**
 * Task interface - represents an executable task
 */
export class Task {
    async execute() {
        throw new Error("execute() must be implemented by subclass");
    }
}
