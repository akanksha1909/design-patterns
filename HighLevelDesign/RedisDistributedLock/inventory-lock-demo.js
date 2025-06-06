const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

const redis = new Redis();
const productInventory = { product_123: 1 };

// Lua script to safely release lock
const releaseLockScript = `
  if redis.call("get", KEYS[1]) == ARGV[1] then
    return redis.call("del", KEYS[1])
  else
    return 0
  end
`;

async function reserveProduct(productId, workerName) {
    const lockKey = `lock:${productId}`;
    const lockValue = uuidv4();

    const acquired = await redis.set(lockKey, lockValue, 'NX', 'EX', 5);

    if (acquired) {
        console.log(`[${workerName}] Lock acquired`);
        try {
            if (productInventory[productId] > 0) {
                productInventory[productId] -= 1;
                console.log(`[${workerName}] Reserved product! Inventory left: ${productInventory[productId]}`);
            } else {
                console.log(`[${workerName}] Out of stock.`);
            }
        } catch (error) {
            console.log(`[${error}] Error occurred`);
        } finally {
            await redis.eval(releaseLockScript, 1, lockKey, lockValue);
            console.log(`[${workerName}] Lock released`);
        }

    } else {
        console.log(`[${workerName}] Could not acquire lock. Try again later.`);
    }
}

if (isMainThread) {
    console.log(`[Main] PID: ${process.pid}`);

    // Main thread: create two workers
    function createWorker(name) {
        const worker = new Worker(__filename, {
            workerData: { name }
        });

        worker.on('message', (msg) => {
            console.log(`[Main] Received from ${name}: ${msg}`);
            if (msg === 'done' || msg === 'error') {
                console.log(`[Main] Worker ${worker.threadId} finished with message: ${msg}`);
                worker.terminate();
            }
        });

        worker.on('error', (err) => {
            console.error(`[Main] Error in ${name}:`, err);
        });

        worker.on('exit', (code) => {
            console.log(`[Main] ${name} exited with code ${code}`);
        });
    }

    createWorker('Worker-1');
    createWorker('Worker-2');
} else {
    console.log(`[${workerData.name}] PID: ${process.pid}`);

    // Worker thread: simulate some work
    const name = workerData.name;

    // Worker thread
    reserveProduct('product_123', workerData.name)
        .then(() => {
            // notify main thread work done
            parentPort.postMessage('done');
            // close communication channel to allow thread to exit gracefully
            parentPort.close();
        })
        .catch(err => {
            console.error(err);
            parentPort.postMessage('error');
            parentPort.close();
        });
}
