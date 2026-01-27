/**
 * Example: How to use Node.js Worker Threads
 * This shows the difference between async functions and actual Worker threads
 */

import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Example 1: Current Implementation (Async Functions)
 * - Runs on same event loop
 * - No true parallelism
 * - Simple memory sharing
 */
class AsyncFunctionWorkers {
    constructor() {
        this.workers = [];
    }

    startWorker(workerId) {
        const worker = async () => {
            while (true) {
                // This runs on the MAIN event loop
                await this.doSomething();
            }
        };
        this.workers.push(worker());
    }
}

/**
 * Example 2: Using Actual Worker Threads
 * - True parallelism (separate threads)
 * - Isolated memory
 * - Need message passing
 */
class WorkerThreadWorkers {
    constructor() {
        this.workers = [];
    }

    startWorker(workerId) {
        // Create a new Worker thread
        const worker = new Worker(join(__dirname, 'worker-script.js'), {
            workerData: { workerId }
        });

        // Listen for messages from worker
        worker.on('message', (message) => {
            console.log(`[MAIN] Received from Worker ${workerId}:`, message);
        });

        // Handle errors
        worker.on('error', (error) => {
            console.error(`[MAIN] Worker ${workerId} error:`, error);
        });

        // Handle worker exit
        worker.on('exit', (code) => {
            console.log(`[MAIN] Worker ${workerId} exited with code ${code}`);
        });

        this.workers.push(worker);
    }

    sendTaskToWorker(workerId, task) {
        // Send task to worker thread
        this.workers[workerId].postMessage({ task });
    }
}

// Example worker script (would be in worker-script.js)
const workerScriptExample = `
import { parentPort, workerData } from 'worker_threads';

const { workerId } = workerData;

// Listen for messages from main thread
parentPort.on('message', (message) => {
    console.log(\`[WORKER \${workerId}] Received task:\`, message.task);
    
    // Process the task
    processTask(message.task);
    
    // Send result back to main thread
    parentPort.postMessage({ 
        workerId, 
        result: 'Task completed' 
    });
});

function processTask(task) {
    // Do CPU-intensive work here
    // This runs in a SEPARATE thread!
}
`;

export { AsyncFunctionWorkers, WorkerThreadWorkers };
