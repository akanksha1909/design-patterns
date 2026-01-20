/**
 * AsyncLock - A simple mutex implementation for Node.js concurrency control
 * Ensures that only one async operation can access a critical section at a time
 * This handles race conditions in Node.js async operations
 * 
 * Implementation uses a queue-based approach:
 * - Each key has a queue of waiting operations
 * - If queue is empty, lock is available
 * - When lock is released, next operation in queue is notified
 */
export class AsyncLock {
  private locks: Map<string, Array<() => void>> = new Map();

  /**
   * Execute a function with a lock
   * This ensures only one async operation executes at a time for a given key
   * @param key - Unique key for the lock
   * @param fn - Function to execute while holding the lock
   * @returns Promise with the result of the function
   */
  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // Wait for lock to be available (this will queue us if needed)
    await this.acquireLock(key);

    try {
      // We now have the lock, execute the function
      return await fn();
    } finally {
      // Always release the lock, even if function throws
      this.releaseLock(key);
    }
  }

  /**
   * Acquire the lock
   * If lock is available (queue is empty), returns immediately
   * Otherwise, adds to queue and waits
   */
  private async acquireLock(key: string): Promise<void> {
    // Get or create the queue for this key
    if (!this.locks.has(key)) {
      this.locks.set(key, []);
      // Queue is empty, lock is immediately available
      return;
    }

    const queue = this.locks.get(key)!;
    
    // If queue is empty, lock is available
    // Note: In Node.js single-threaded event loop, this check is atomic
    // because no other async operation can interleave between check and return
    if (queue.length === 0) {
      return;
    }

    // Queue has waiting operations, add ourselves to the queue and wait
    return new Promise<void>((resolve) => {
      queue.push(resolve);
    });
  }

  /**
   * Release the lock and notify the next waiting operation
   */
  private releaseLock(key: string): void {
    const queue = this.locks.get(key);
    if (!queue) {
      // This shouldn't happen, but handle gracefully
      return;
    }

    // Notify the next waiting operation (if any)
    const next = queue.shift();
    if (next) {
      // Resolve the promise, allowing the next operation to proceed
      next();
    }

    // Clean up empty queues to prevent memory leaks
    if (queue.length === 0) {
      this.locks.delete(key);
    }
  }
}
