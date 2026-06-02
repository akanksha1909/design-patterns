# Node.js Concurrency and Locks Demonstration

This project demonstrates how concurrency works in Node.js and how to use locks to handle race conditions in asynchronous operations.

## What is Concurrency in Node.js?

Node.js is single-threaded but handles concurrency through its event loop. When you have multiple async operations (like `setTimeout`, `Promise`, I/O operations), they can execute concurrently. However, if these operations modify shared state, you can encounter **race conditions**.

## The Problem: Race Conditions

A race condition occurs when multiple async operations access and modify the same shared resource simultaneously, leading to unpredictable results.

### Example Scenario

Imagine 100 async operations trying to increment a counter:
1. Operation A reads the counter value: `0`
2. Operation B reads the counter value: `0` (before A writes)
3. Operation A increments and writes: `1`
4. Operation B increments and writes: `1` (overwrites A's work!)

Result: Two operations only resulted in one increment!

## The Solution: Locks (Mutex)

A lock (mutex) ensures that only one async operation can access a critical section at a time. Other operations wait in a queue until the lock is released.

## Project Structure

```
nodejs-concurrency/
├── src/
│   ├── Lock.ts          # Simple mutex lock implementation
│   ├── Counter.ts       # Counter class to demonstrate race conditions
│   └── Demo.ts          # Demonstration examples
├── package.json
├── tsconfig.json
└── README.md
```

## How to Run

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the demonstration:
```bash
npm start
```

Or use the dev script for auto-rebuild:
```bash
npm run dev
```

## Understanding the Code

### Lock Implementation (`Lock.ts`)

The `Lock` class provides:
- `acquire()`: Acquires the lock, waiting if necessary
- `release()`: Releases the lock for the next waiting operation
- `withLock(fn)`: Convenience method that automatically acquires and releases

### Counter (`Counter.ts`)

A simple counter that simulates async operations with random delays to make race conditions more likely.

### Demo (`Demo.ts`)

Three examples:
1. **Race Condition**: Shows how concurrent operations without locks lose data
2. **With Locks**: Shows how locks prevent race conditions
3. **Complex Operations**: Demonstrates locks with mixed operation types

## Key Concepts

### 1. Concurrency in Node.js
- Node.js uses an event loop for async operations
- Multiple promises can execute concurrently
- Without synchronization, shared state can be corrupted

### 2. Critical Sections
- Code that reads, modifies, and writes shared state
- Must be protected to prevent race conditions

### 3. Locks (Mutex)
- Ensures mutual exclusion
- Only one operation holds the lock at a time
- Other operations wait in a queue

### 4. Lock Pattern
```typescript
await lock.acquire();
try {
  // Critical section - modify shared state
  await doSomething();
} finally {
  lock.release(); // Always release, even on error
}
```

Or use the convenience method:
```typescript
await lock.withLock(async () => {
  // Critical section
  await doSomething();
});
```

## Real-World Applications

Locks are useful when:
- Multiple async operations modify shared in-memory state
- Implementing thread-safe data structures
- Preventing race conditions in concurrent algorithms
- Coordinating access to shared resources

## Note

This is a simple educational implementation. For production use, consider:
- More sophisticated lock implementations
- Read-write locks for better performance
- Deadlock detection and prevention
- Timeout mechanisms for lock acquisition
