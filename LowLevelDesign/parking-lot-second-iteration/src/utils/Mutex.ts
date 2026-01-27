/**
 * Simple Mutex implementation for synchronizing access to shared resources
 */
export class Mutex {
    private _locked: boolean = false;
    private _waitingQueue: Array<() => void> = [];

    /**
     * Acquire the lock. Waits if lock is already held.
     */
    public async acquire(): Promise<void> {
        if (!this._locked) {
            this._locked = true;
            return Promise.resolve();
        }

        return new Promise<void>((resolve) => {
            this._waitingQueue.push(resolve);
        });
    }

    /**
     * Try to acquire the lock without waiting.
     * @returns true if lock was acquired, false otherwise
     */
    public tryAcquire(): boolean {
        if (!this._locked) {
            this._locked = true;
            return true;
        }
        return false;
    }

    /**
     * Release the lock and notify the next waiting thread.
     */
    public release(): void {
        if (!this._locked) {
            throw new Error("Cannot release an unlocked mutex");
        }

        this._locked = false;

        if (this._waitingQueue.length > 0) {
            const next = this._waitingQueue.shift();
            if (next) {
                this._locked = true;
                next();
            }
        }
    }

    /**
     * Check if the lock is currently held.
     */
    public isLocked(): boolean {
        return this._locked;
    }
}
