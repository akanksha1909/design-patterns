/**
 * KeyBasedExecutor ensures that all operations for the same key
 * are executed sequentially, while operations for different keys
 * can run concurrently.
 */

import crypto from 'crypto';
import { MutexLock } from "../Utils/MutexLock";


export class KeyBasedExecutor {
    private numExecutors;
    private queues;
    private locks;

    constructor(numExecutors) {
        this.numExecutors = numExecutors;
        this.queues = new Map();
        this.locks = new Map();

        for (let i = 0; i < numExecutors; i++) {
            this.queues.set(i, []);
            this.locks.set(i, new MutexLock());
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
        const lock: MutexLock = this.locks.get(index);
        await lock.runExclusive(async () => {
            const queue = this.queues.get(index);
            while (queue.length > 0) {
                const task = queue.shift();
                await task();
            }
        });
    }
    
    shutdown() {
        for(let i=0; i< this.numExecutors; i++){
            this.queues.get(i).length = 0;
        }
    }
}
