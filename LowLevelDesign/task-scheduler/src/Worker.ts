import { parentPort } from "worker_threads";

if (!parentPort) {
    throw new Error("Worker must have parentPort")
}

parentPort.on("message", (task) => {
    console.log("Worker Received Task:", task.id);

    // Simulate heavy CPU work
    const result = heavyTask(task.payload.imageName);
    parentPort?.postMessage({
        taskId: task.id,
        result
    })
});

function heavyTask(imageName: string) {
    let sum = 0;
    for (let i = 0; i < 5e7; i++) {
        sum += i;
    }
    return `Processed ${imageName}`;
}