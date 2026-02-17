export class MutexLock {
    private locked: boolean = false;
    private waiting: Array<() => void> = [];

    /**
     * Acquires the lock and returns a release function.
     * The caller must always call the returned release function in a finally block.
     */
    private async acquire(): Promise<() => void> {
        return new Promise<() => void>((resolve) => {
            const release = () => {
                const next = this.waiting.shift();
                if (next) {
                    next();
                } else {
                    this.locked = false;
                }
            };

            if (!this.locked) {
                this.locked = true;
                resolve(release);
            } else {
                this.waiting.push(() => resolve(release));
            }
        });
    }

    /**
     * Runs the given function exclusively under the mutex.
     */
    async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
        const release = await this.acquire();
        try {
            return await fn();
        } finally {
            release();
        }
    }
}

