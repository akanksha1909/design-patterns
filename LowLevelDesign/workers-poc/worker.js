const { parentPort } = require("node:worker_threads");


for (let i = 0; i < 100; i++) {
    parentPort.postMessage(`Reached ${i}`);
}

parentPort.postMessage("DONE");
