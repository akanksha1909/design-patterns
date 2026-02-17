/**
 * KeyBasedExecutor ensures that all operations for the same key
 * are executed sequentially, while operations for different keys
 * can run concurrently.
 */

import crypto from 'crypto';


export class KeyBasedExecutor {
    private numExecutors;
    private queues;
    private processing;

    constructor(numExecutors) {
        this.numExecutors = numExecutors;
        this.queues = new Map();
        this.processing = new Map();

        for (let i = 0; i < numExecutors; i++) {
            this.queues.set(i, []);
            this.processing.set(i, false);
        }
    }

    getExecutorIndexForKey(key) {
        const hashCode = this.hashKey(key)
        return hashCode % (this.numExecutors);
    }

    hashKey(key) {
        const hash = crypto.createHash('sha256').update(key).digest('hex')
        return parseInt(hash.slice(0, 8), 16);
    }

    submitTask(key, task) {
        const index = this.getExecutorIndexForKey(key);
        const queue = this.queues.get(index);
        return new Promise((resolve, reject) => {
            queue.push(async () => {
                try {
                    const result = await task();
                    resolve(result)
                } catch (error) {
                    reject(error)
                }
            })
            this.processQueue(index)
        })
    }


    async processQueue(index) {
        if (this.processing.get(index)) {
            return
        }
        this.processing.set(index, true)
        while (true) {
            const queue = this.queues.get(index);
            if (queue.length == 0) {
                this.processing.set(index, false);
                break;
            }
            const task = queue.shift();
            await task();
        }
    }

    shutdown() {
        for(let i=0; i< this.numExecutors; i++){
            this.queues.get(i).length = 0;
            this.processing.set(i, false);
        }
    }
}