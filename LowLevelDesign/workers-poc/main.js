const { Worker } = require('node:worker_threads');

const worker = new Worker('./worker.js')

worker.on("message", (msg) => {
    console.log("Worker says: ", msg);
});

worker.on("error", (err) => {
    console.error("Worker Error: ", err);
});

worker.on("exit", (code) => {
    console.log("Worker exited with code: ", code);
});

console.log("hello"); // 🚀 prints immediately
