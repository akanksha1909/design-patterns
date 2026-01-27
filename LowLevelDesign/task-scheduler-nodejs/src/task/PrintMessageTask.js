import { Task } from './Task.js';

/**
 * PrintMessageTask - Example task implementation that prints a message
 */
export class PrintMessageTask extends Task {
    constructor(message) {
        super();
        this.message = message;
    }

    async execute() {
        console.log(`[${new Date().toISOString()}] Executing PrintMessageTask: ${this.message}`);
    }
}
