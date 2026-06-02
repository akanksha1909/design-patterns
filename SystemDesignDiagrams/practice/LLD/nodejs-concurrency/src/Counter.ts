/**
 * A simple counter class to demonstrate race conditions
 * 
 * Think of this as a "piggy bank" or "scoreboard" that starts at 0.
 * Multiple operations can try to increment it at the same time.
 * 
 * The problem: If two operations read the value at the same time,
 * they both see the same number, and when they write, they overwrite
 * each other's work!
 */
export class Counter {
  private value: number = 0;  // Our "piggy bank" - starts with $0

  /**
   * Increments the counter by 1
   * 
   * This simulates a real-world async operation that:
   * 1. Does some work (like reading from a file or database)
   * 2. Reads the current value
   * 3. Does some more work (like processing)
   * 4. Writes the new value
   * 
   * The random delays make race conditions more likely to happen!
   */
  async increment(): Promise<void> {
    // STEP 1: Simulate some async work (like reading from a file, network call, etc.)
    // The random delay (0-10ms) simulates real-world unpredictability
    // This is like "walking to the piggy bank"
    await this.delay(Math.random() * 10);
    
    // STEP 2: This is the CRITICAL SECTION - the dangerous part!
    // We read the current value
    // ⚠️ DANGER: If another operation reads at the same time, we both see the same value!
    const current = this.value;  // "I see the piggy bank has $X"
    
    // STEP 3: Another delay (simulating processing time)
    // This is like "thinking about what to do"
    await this.delay(Math.random() * 10);
    
    // STEP 4: Write the new value
    // ⚠️ DANGER: If another operation writes at the same time, we overwrite each other!
    this.value = current + 1;  // "I'll make it $(X+1)"
    
    // The problem: If Operation A and Operation B both read "0" at the same time,
    // they both calculate "0 + 1 = 1", and both write "1".
    // We wanted 2, but we got 1! We lost one increment!
  }

  /**
   * Increments the counter by a specific amount
   * 
   * Same idea as increment(), but adds a custom amount instead of always 1.
   * This is used in Example 3 to show locks work with different operations.
   */
  async incrementBy(amount: number): Promise<void> {
    // Same pattern: delay, read, delay, write
    // This simulates adding $2, $5, or any amount to the piggy bank
    await this.delay(Math.random() * 10);
    const current = this.value;  // Read current value
    await this.delay(Math.random() * 10);
    this.value = current + amount;  // Add the specified amount
  }

  /**
   * Gets the current value
   */
  getValue(): number {
    return this.value;
  }

  /**
   * Resets the counter to 0
   */
  reset(): void {
    this.value = 0;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

