# Concurrency Handling in Node.js Rate Limiter

## The Problem: Race Conditions in Async Operations

Even though Node.js is single-threaded, async operations can interleave, leading to race conditions when multiple operations access shared state.

### Example Race Condition

Consider this scenario without proper locking:

```typescript
class TokenBucket {
  private tokens = 10;

  async allowRequest() {
    if (this.tokens > 0) {
      // ⚠️ RACE CONDITION HERE!
      this.tokens--;
      return true;
    }
    return false;
  }
}
```

**Timeline of concurrent requests:**

```
Time    Request 1                    Request 2                    Request 3
─────────────────────────────────────────────────────────────────────────────
T1      Check: tokens = 10
T2                                    Check: tokens = 10
T3                                                                    Check: tokens = 10
T4      Decrement: tokens = 9
T5                                    Decrement: tokens = 9  ❌ Should be 8!
T6                                                                    Decrement: tokens = 9  ❌ Should be 7!
```

**Result:** All three requests see `tokens = 10` and all decrement. Final value is `9` instead of `7`. **3 tokens consumed but only 1 should have been!**

## The Solution: AsyncLock (Mutex)

The `AsyncLock` ensures that only one async operation can execute a critical section at a time.

### How AsyncLock Works

```typescript
class AsyncLock {
  private locks: Map<string, Array<() => void>> = new Map();

  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    // 1. Wait for lock to be available
    await this.waitForLock(key);
    
    // 2. Acquire lock
    this.acquireLock(key);
    
    try {
      // 3. Execute critical section (only one at a time)
      return await fn();
    } finally {
      // 4. Release lock and notify next waiting operation
      this.releaseLock(key);
    }
  }
}
```

### Protected Operations

With AsyncLock, the same scenario:

```typescript
class TokenBucket {
  private tokens = 10;
  private lock = new AsyncLock();

  async allowRequest(identifier: string) {
    return this.lock.execute(identifier, async () => {
      if (this.tokens > 0) {
        this.tokens--;  // ✅ Only one request can execute this at a time
        return true;
      }
      return false;
    });
  }
}
```

**Timeline with AsyncLock:**

```
Time    Request 1                    Request 2                    Request 3
─────────────────────────────────────────────────────────────────────────────
T1      Acquire lock ✅
T2      Check: tokens = 10
T3      Decrement: tokens = 9
T4      Release lock ✅
T5                                    Acquire lock ✅
T6                                    Check: tokens = 9
T7                                    Decrement: tokens = 8
T8                                    Release lock ✅
T9                                                                    Acquire lock ✅
T10                                                                   Check: tokens = 8
T11                                                                   Decrement: tokens = 7
T12                                                                   Release lock ✅
```

**Result:** Operations execute sequentially. Final value is `7` ✅

## Implementation Details

### Queue-Based Locking

The AsyncLock uses a queue to manage waiting operations:

```typescript
private locks: Map<string, Array<() => void>> = new Map();
```

- Each identifier has its own queue
- When a lock is acquired, subsequent operations wait in the queue
- When a lock is released, the next operation in the queue is notified
- Operations execute one at a time per identifier

### Per-Identifier Locking

Different identifiers have independent locks:

```typescript
// User 1 and User 2 can execute concurrently
await lock.execute('user-1', async () => { /* ... */ });
await lock.execute('user-2', async () => { /* ... */ });

// But multiple operations for the same user are serialized
await Promise.all([
  lock.execute('user-1', async () => { /* ... */ }),  // Executes first
  lock.execute('user-1', async () => { /* ... */ }),  // Waits, then executes
]);
```

This allows:
- ✅ Concurrent processing of different users
- ✅ Serialized processing for the same user (prevents race conditions)

## Testing Concurrency

### Test: Concurrent Requests

```typescript
test('Concurrent requests should respect capacity', async () => {
  const rateLimiter = new RateLimiter(new TokenBucketStrategy(5, 1));
  
  // Make 20 concurrent requests
  const promises = Array.from({ length: 20 }, () =>
    rateLimiter.allowRequest('user-123')
  );
  
  const results = await Promise.all(promises);
  const allowedCount = results.filter(Boolean).length;
  
  // Should only allow 5 requests (bucket capacity)
  expect(allowedCount).toBe(5);
});
```

**Without AsyncLock:** Could allow 6-20 requests (race condition)  
**With AsyncLock:** Always allows exactly 5 requests ✅

## Performance Considerations

### Lock Granularity

- **Fine-grained:** Lock per identifier (current implementation)
  - ✅ Better concurrency (different users don't block each other)
  - ✅ More memory usage (one lock per identifier)

- **Coarse-grained:** Single global lock
  - ❌ Poor concurrency (all users block each other)
  - ✅ Less memory usage

### Lock Overhead

- Lock acquisition/release: ~microseconds
- Critical section execution: depends on operation
- For rate limiting: Lock overhead is negligible compared to network I/O

## Best Practices

1. **Lock only critical sections:** Don't lock entire functions unnecessarily
2. **Use per-identifier locks:** Allow concurrent processing of different users
3. **Always release locks:** Use try/finally to ensure locks are released
4. **Test concurrency:** Always test with concurrent requests to verify correctness

## Alternative Solutions

### 1. Redis with Atomic Operations
For distributed systems:
```typescript
// Redis INCR is atomic
const count = await redis.incr(`rate-limit:${userId}`);
if (count === 1) {
  await redis.expire(`rate-limit:${userId}`, windowSize);
}
```

### 2. Database Transactions
For persistent storage:
```typescript
await db.transaction(async (tx) => {
  const count = await tx.increment(userId);
  if (count > maxRequests) {
    throw new RateLimitError();
  }
});
```

### 3. Worker Threads (Node.js)
For CPU-intensive operations:
```typescript
import { Worker } from 'worker_threads';
// Use SharedArrayBuffer with Atomics for thread-safe operations
```

## Conclusion

The AsyncLock implementation provides:
- ✅ Thread-safe operations in Node.js async environment
- ✅ Per-identifier locking for better concurrency
- ✅ Simple API that's easy to use correctly
- ✅ No external dependencies

This ensures that rate limiting works correctly even under high concurrency, preventing token over-consumption and maintaining accurate rate limits.
