import { Counter } from './Counter.js';
import { Lock } from './Lock.js';

/**
 * Demonstrates concurrency issues and how locks solve them
 */
async function demonstrateConcurrency() {
  console.log('='.repeat(60));
  console.log('Node.js Concurrency and Locks Demonstration');
  console.log('='.repeat(60));
  console.log();

  // Example 1: Race condition without locks
  await demonstrateRaceCondition();

  console.log('\n' + '-'.repeat(60) + '\n');

  // Example 2: Using locks to prevent race conditions
  await demonstrateWithLocks();

  console.log('\n' + '-'.repeat(60) + '\n');

  // Example 3: Multiple operations with locks
  await demonstrateMultipleOperations();
}

/**
 * EXAMPLE 1: The Messy Playground (Race Condition Without Locks)
 * 
 * Imagine 100 friends all trying to add $1 to a shared piggy bank at the same time.
 * Without locks, they all rush in together and mess up each other's work!
 * 
 * What happens:
 * 1. All 100 operations start at the same time (concurrent)
 * 2. They all read the counter value (probably 0) at nearly the same time
 * 3. They all try to write their new value (1) at nearly the same time
 * 4. They overwrite each other! Only the last one "wins"
 * 5. Result: We lose most of the increments!
 */
async function demonstrateRaceCondition() {
  console.log('Example 1: Race Condition (Without Locks)');
  console.log('----------------------------------------');
  console.log('Starting 100 concurrent increment operations...\n');

  // Create our "piggy bank" (counter) starting at 0
  const counter = new Counter();
  
  // This array will hold all 100 "promises" (like 100 friends making promises to add money)
  const operations: Promise<void>[] = [];

  // Remember when we started (to measure how long it takes)
  const startTime = Date.now();

  // STEP 1: Launch 100 operations all at once!
  // Think of this as telling 100 friends: "Everyone go add $1 to the piggy bank RIGHT NOW!"
  // They all rush to the piggy bank at the same time - chaos!
  for (let i = 0; i < 100; i++) {
    // Each operation is like a friend trying to:
    // 1. Read the current value (e.g., "I see $0")
    // 2. Add 1 to it (e.g., "I'll make it $1")
    // 3. Write the new value (e.g., "Now it's $1")
    // But since they all do this at the same time, they mess up!
    //
    // Note: We're NOT using 'await' here! That's intentional.
    // We want all 100 operations to START at the same time (concurrently).
    // Each operation returns a Promise immediately, but the actual work happens
    // asynchronously. We'll wait for all of them later with Promise.all().
    operations.push(counter.increment());
  }

  // STEP 2: Wait for all operations to finish
  // This is like waiting for all 100 friends to finish trying to add money
  //
  // 🔍 WHY Promise.all() HERE?
  // Without Promise.all(), we would check the counter value immediately
  // (maybe only 5-10 operations have finished), getting a wrong answer!
  //
  // Promise.all() waits for ALL 100 promises to complete.
  // Even though they run concurrently, we wait until EVERYONE is done
  // before checking the result.
  await Promise.all(operations);

  // STEP 3: Check the results
  const endTime = Date.now();
  const finalValue = counter.getValue(); // What's actually in the piggy bank?

  console.log(`Expected value: 100`);  // We wanted 100 friends × $1 = $100
  console.log(`Actual value: ${finalValue}`);  // But we probably got much less!
  console.log(`Time taken: ${endTime - startTime}ms`);
  console.log(`\n❌ Race condition detected! Lost ${100 - finalValue} increments.`);
  console.log('\nWhy did this happen?');
  console.log('- Multiple async operations read the same value simultaneously');
  console.log('- They all increment from the same base value');
  console.log('- The final write overwrites previous increments');
  console.log('\n💡 Think of it like: 100 people all writing on the same whiteboard');
  console.log('   at the same time - they erase each other\'s work!');
}

/**
 * EXAMPLE 2: The Organized Line (Using Locks)
 * 
 * Same situation: 100 friends want to add $1 to the piggy bank.
 * But now we have a SPECIAL KEY (lock)!
 * 
 * Rules:
 * - Only ONE person can hold the key at a time
 * - When you have the key, you can use the piggy bank safely
 * - When you're done, you MUST give the key to the next person
 * - Everyone else waits in line patiently
 * 
 * What happens:
 * 1. All 100 operations start, but they must wait for the key
 * 2. Operation 1 gets the key, does its work, gives key to Operation 2
 * 3. Operation 2 gets the key, does its work, gives key to Operation 3
 * 4. And so on... one at a time, in order
 * 5. Result: Perfect! All 100 increments are preserved!
 */
async function demonstrateWithLocks() {
  console.log('Example 2: Using Locks to Prevent Race Conditions');
  console.log('-------------------------------------------------');
  console.log('Starting 100 concurrent increment operations with locks...\n');

  // Create our "piggy bank" (counter) starting at 0
  const counter = new Counter();
  
  // Create our "special key" (lock) - only one person can hold it at a time!
  const lock = new Lock();
  
  // Array to hold all 100 operations
  const operations: Promise<void>[] = [];

  const startTime = Date.now();

  // STEP 1: Launch 100 operations, but this time with locks!
  // Think of this as: "100 friends want to add money, but they must wait in line
  // and use the special key one at a time"
  for (let i = 0; i < 100; i++) {
    operations.push(
      // lock.withLock() is like saying:
      // "Wait until I can get the key, do my work, then give the key to the next person"
      lock.withLock(async () => {
        // This is the "work" - adding $1 to the piggy bank
        // But now it's SAFE because we have the key!
        // No one else can use the piggy bank while we have the key
        
        // 🔍 WHY AWAIT HERE?
        // counter.increment() is an async function that returns a Promise.
        // Without 'await', this function would return immediately without waiting
        // for the increment to actually finish! The 'await' ensures we wait for
        // the increment operation to complete (including all its delays and
        // read/write operations) before moving on.
        await counter.increment();
      })
    );
  }

  // STEP 2: Wait for all operations to finish
  // Even though they wait in line, they all eventually finish
  //
  // 🔍 WHY Promise.all() HERE?
  // We started 100 operations, and each one returns a Promise.
  // Without Promise.all(), we would check the counter value IMMEDIATELY
  // (before all operations finish), getting a wrong answer!
  //
  // Promise.all() waits for ALL 100 promises to complete before continuing.
  // Think of it like: "Wait until ALL friends finish adding money, THEN check the piggy bank"
  //
  // What happens:
  // - All 100 operations start (they run concurrently/in parallel)
  // - Each operation waits for the lock, does its work, releases the lock
  // - Promise.all() waits until ALL 100 are completely done
  // - Only THEN do we check the final value (which will be correct!)
  await Promise.all(operations);

  // STEP 3: Check the results
  const endTime = Date.now();
  const finalValue = counter.getValue();

  console.log(`Expected value: 100`);  // We wanted 100 friends × $1 = $100
  console.log(`Actual value: ${finalValue}`);  // And we got it! Perfect!
  console.log(`Time taken: ${endTime - startTime}ms`);
  console.log(`\n✅ All increments preserved! Lock prevented race condition.`);
  console.log('\nHow locks work:');
  console.log('- Only one operation can hold the lock at a time');
  console.log('- Other operations wait in a queue (like a line at a store)');
  console.log('- Each operation completes before the next starts');
  console.log('- This ensures atomic read-modify-write operations');
  console.log('\n💡 Think of it like: A bathroom with one key - people wait in line,');
  console.log('   use it one at a time, and everything works perfectly!');
}

/**
 * EXAMPLE 3: Mixed Operations (Complex Example with Locks)
 * 
 * Now we have different types of friends:
 * - 50 friends want to add $1 each
 * - 30 friends want to add $2 each  
 * - 20 friends want to add $5 each
 * 
 * Expected total: 50×$1 + 30×$2 + 20×$5 = $50 + $60 + $100 = $210
 * 
 * Even though they're doing different things, they all need the same piggy bank.
 * So they still need to wait in line (use the lock)!
 * 
 * We'll also shuffle them randomly to show that locks work no matter what order
 * the operations run in.
 */
async function demonstrateMultipleOperations() {
  console.log('Example 3: Complex Operations with Locks');
  console.log('----------------------------------------');
  console.log('Performing mixed operations (increment by different amounts)...\n');

  const counter = new Counter();
  const lock = new Lock();
  const operations: Promise<void>[] = [];

  // STEP 1: Create 50 operations that add $1 each
  // These are like 50 friends who each want to add $1
  for (let i = 0; i < 50; i++) {
    operations.push(
      lock.withLock(async () => {
        await counter.increment();  // Add 1
      })
    );
  }

  // STEP 2: Create 30 operations that add $2 each
  // These are like 30 friends who each want to add $2
  for (let i = 0; i < 30; i++) {
    operations.push(
      lock.withLock(async () => {
        await counter.incrementBy(2);  // Add 2
      })
    );
  }

  // STEP 3: Create 20 operations that add $5 each
  // These are like 20 friends who each want to add $5
  for (let i = 0; i < 20; i++) {
    operations.push(
      lock.withLock(async () => {
        await counter.incrementBy(5);  // Add 5
      })
    );
  }

  // STEP 4: Shuffle (mix up) all the operations randomly
  // This is like shuffling a deck of cards - we mix up the order
  // But it doesn't matter! The lock ensures they still wait in line
  shuffleArray(operations);

  // STEP 5: Run all operations and wait for them to finish
  // 🔍 WHY Promise.all() HERE?
  // Same reason as Example 2 - we need to wait for ALL 100 operations
  // (50 + 30 + 20) to complete before checking the result.
  // Without it, we'd check too early and get a wrong answer!
  const startTime = Date.now();
  await Promise.all(operations);
  const endTime = Date.now();

  // STEP 6: Check the results
  const finalValue = counter.getValue();
  const expectedValue = 50 * 1 + 30 * 2 + 20 * 5; // 50 + 60 + 100 = 210

  console.log(`Expected value: ${expectedValue}`);  // We expect $210
  console.log(`Actual value: ${finalValue}`);  // And we get it! Perfect!
  console.log(`Time taken: ${endTime - startTime}ms`);
  console.log(`\n✅ All operations completed correctly with locks!`);
  console.log('\n💡 This shows that locks work even when:');
  console.log('   - Different operations do different things');
  console.log('   - Operations run in random order');
  console.log('   - You have a mix of simple and complex operations');
  console.log('   The lock ensures correctness no matter what!');
}

/**
 * Utility function to shuffle an array
 * 
 * This is like shuffling a deck of cards - it randomly mixes up the order
 * of items in the array. We use this to show that locks work even when
 * operations run in a random order!
 */
function shuffleArray<T>(array: T[]): void {
  // Go through the array from the end to the beginning
  for (let i = array.length - 1; i > 0; i--) {
    // Pick a random position between 0 and i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the items at positions i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Run the demonstration
demonstrateConcurrency().catch(console.error);
