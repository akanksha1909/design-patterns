export class Lock {
    private locked: boolean;
    private queue;
    constructor() {
        this.locked = false;
        this.queue = [];
    }

    async acquireLock() {
        return new Promise<void>((resolve, reject) => {
            if (!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.queue.push(resolve)
            }
        })
    }

    releaseLock() {
        if(this.queue.length > 0) {
            const next = this.queue.shift();
            if(next) {
                // Lock remains locked, just pass it to the next waiter
                next();
            } else {
                this.locked = false;
            }
        } else {
            this.locked = false;
        }
    }

    async withLock(fn) {
        await this.acquireLock()
        try {
            return await fn()
        } finally {
            this.releaseLock();
        }
    }
}