/**
 * AsyncLock - Provides mutex-like behavior for async operations in Node.js
 * Ensures thread-safe execution of critical sections
 */
class AsyncLock {
  constructor() {
    this.locks = new Map(); // Map of lock keys to their queues
  }

  /**
   * Acquires a lock for the given key
   * @param {string} key - The lock key
   * @returns {Promise<Function>} - Promise that resolves with release function
   */
  async acquire(key) {
    if (!this.locks.has(key)) {
      this.locks.set(key, []);
    }

    const queue = this.locks.get(key);
    
    return new Promise((resolve) => {
      queue.push(resolve);
      
      // If this is the first item in queue, grant lock immediately
      if (queue.length === 1) {
        resolve(this._createRelease(key));
      }
    });
  }

  /**
   * Creates a release function for the given lock key
   * @private
   */
  _createRelease(key) {
    return () => {
      const queue = this.locks.get(key);
      queue.shift(); // Remove current lock holder
      
      // Grant lock to next waiting operation
      if (queue.length > 0) {
        const nextResolve = queue[0];
        nextResolve(this._createRelease(key));
      } else {
        // Clean up empty queues
        this.locks.delete(key);
      }
    };
  }

  /**
   * Executes a function with a lock
   * @param {string} key - The lock key
   * @param {Function} fn - Async function to execute
   * @returns {Promise<any>} - Result of the function
   */
  async execute(key, fn) {
    const release = await this.acquire(key);
    try {
      return await fn();
    } finally {
      release();
    }
  }
}

module.exports = AsyncLock;
