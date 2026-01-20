export async function delay(ms): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}


export class Mutex {
    private locked: boolean;
    private queue;

    constructor() {
        this.locked = false;
        this.queue = [];
    }

    acquireLock(): Promise<void> {
        return new Promise((resolve, reject) => {
            if(!this.locked) {
                this.locked = true;
                resolve();
            } else {
                this.queue.push(resolve);
            }
        })
     
    }

    releaseLock() {
        if(this.queue.length > 0) {
            const next = this.queue.shift();
            if(next) {
                next();
            } else {
                this.locked = false;
            }
        } else {
            this.locked = false;
        }
    }

    async execute(fn) {
        await this.acquireLock();
        try {
            return await fn();
        } finally {
            this.releaseLock();
        }
    }
}