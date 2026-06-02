/**
 * A simple mutex lock implementation for Node.js
 * 
 * Think of this as a "special key" or "talking stick":
 * - Only ONE person can hold the key at a time
 * - When you have the key, you can do your work safely
 * - When you're done, you MUST give the key to the next person
 * - Everyone else waits in line patiently
 * 
 * Uses a queue-based approach to ensure only one async operation
 * can acquire the lock at a time.
 */
export class Lock {
  private locked: boolean = false;  // Is someone using the key right now?
  private queue: Array<() => void> = [];  // Line of people waiting for the key

  /**
   * Acquires the lock. If the lock is already held, waits until it's released.
   * 
   * This is like asking: "Can I have the key?"
   * - If the key is free: "Yes! Here you go!" (lock it and continue)
   * - If someone else has it: "Wait in line!" (add to queue)
   * 
   * @returns A promise that resolves when the lock is acquired
   */
  async acquire(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (!this.locked) {
        // ✅ The key is free! I can take it!
        this.locked = true;  // Mark it as "in use"
        resolve();  // Continue with my work
      } else {
        // ❌ Someone else has the key. I must wait in line.
        // Add myself to the queue - I'll be called when it's my turn
        this.queue.push(resolve);
      }
    });
  }

  /**
   * Releases the lock and allows the next waiting operation to proceed
   * 
   * This is like saying: "I'm done! Here's the key for the next person!"
   * - If someone is waiting: Give the key to the next person in line
   * - If no one is waiting: Just mark the key as "free"
   */
  release(): void {
    if (this.queue.length > 0) {
      // There's someone waiting! Give them the key
      const next = this.queue.shift();  // Get the first person in line
      if (next) {
        next();  // "Your turn! Here's the key!" (this calls their resolve function)
        // Note: We don't set locked = false here because the next person now has it!
      }
    } else {
      // No one is waiting. The key is now free!
      this.locked = false;
    }
  }

  /**
   * Executes a function with the lock acquired, automatically releasing it afterwards
   * 
   * This is a CONVENIENCE METHOD that makes it easy to use locks safely.
   * It automatically:
   * 1. Gets the key (acquire)
   * 2. Does your work (runs the function)
   * 3. Gives the key to the next person (release) - EVEN IF THERE'S AN ERROR!
   * 
   * The "finally" block ensures we ALWAYS release the lock, even if something goes wrong.
   * This prevents "deadlocks" where the key gets stuck forever!
   * 
   * @param fn The function to execute (your work)
   * @returns The result of the function
   */
  async withLock<T>(fn: () => Promise<T>): Promise<T> {
    await this.acquire();  // Step 1: Get the key (wait if needed)
    try {
      return await fn();  // Step 2: Do your work safely
    } finally {
      this.release();  // Step 3: ALWAYS give the key back (even if there's an error!)
    }
  }
}
