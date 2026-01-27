import { Task } from "./Task";

export class PrintMessage implements Task {
    private message: string;
    constructor(message: string) {
        this.message = message;
    }

    execute() {
        console.log(`[${new Date().toISOString()}] Executing PrintMessageTask: ${this.message}`);
    }
}