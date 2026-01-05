import path from "path";
import { Worker } from 'worker_threads';
import { fileURLToPath } from "url";
import type { Task } from "./types/Task.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class TaskScheduler {
    // Keeps a reference to all workers ever created
    private workers: Worker[] = [];
    private idleWorkers: Worker[] = [];
    private queue: Task[] = [];
    constructor(workersCount: number) {
        for (let i = 0; i < workersCount; i++) {
            const worker = new Worker(path.resolve(__dirname + "/worker.js"));
            worker.on("message", (msg) => {
                console.log("Task Completed:", msg);
                this.idleWorkers.push(worker);
                this.dispatch();
            });

            worker.on("error", console.error);
            this.workers.push(worker);
            this.idleWorkers.push(worker);
        }

    }

    submit(task: any) {
        console.log("📥 Task queued:", task.id);
        this.queue.push(task);
        this.dispatch()
    }

    dispatch() {
        while(this.queue.length && this.idleWorkers.length) {
            const worker = this.idleWorkers.pop();
            const task = this.queue.shift();

            // Sends a message to worker and listen on worker.on("message")
            worker?.postMessage(task);
        }
    }
}