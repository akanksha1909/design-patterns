export class MutexLock {
    constructor() {
        this.locks = new Map(); // userId -> { locked, queue }
    }

    acquireLock(userId) {
        return new Promise((resolve, reject) => {
            if (!this.locks.has(userId)) {
                this.locks.set(userId, {
                    locked: true,
                    queue: []
                })
                resolve()
            } else {
                const lock = this.locks.get(userId)
                if (!lock.locked) {
                    lock.locked = true;
                    resolve()
                } else {
                    lock.queue.push(resolve)
                }
            }
        })
    }

    releaseLock(userId) {
        const lock = this.locks.get(userId)
        if (!lock) {
            return
        }
        if (lock.queue.length > 0) {
            const next = lock.queue.shift()
            if (next) {
                next()
            }
        } else {
            lock.locked = false;
        }
    }

    async execute(userId, fn) {
        await this.acquireLock(userId)
        try {
            return await fn()
        } finally {
            this.releaseLock(userId)
        }
    }

}