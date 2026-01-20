# Rate Limiter POC - Token Bucket with Strategy Pattern

A production-ready rate limiter implementation featuring:
- **Token Bucket Algorithm** - Smooth rate limiting with token refill
- **Strategy Pattern** - Extensible design supporting multiple algorithms
- **Concurrency Handling** - Thread-safe operations for Node.js async operations
- **Multiple Algorithms** - Token Bucket, Fixed Window, and Sliding Window

## Architecture

### Strategy Pattern

The implementation uses the **Strategy Pattern** to allow different rate limiting algorithms to be interchangeable:

```
RateLimiter (Context)
    ↓ uses
RateLimiterStrategy (Strategy Interface)
    ↓ implemented by
TokenBucketStrategy | FixedWindowStrategy | SlidingWindowStrategy
```

**Benefits:**
- **Open/Closed Principle**: Open for extension (new strategies), closed for modification
- **Single Responsibility**: Each strategy handles one algorithm
- **Runtime Flexibility**: Strategies can be swapped at runtime
- **Easy Testing**: Strategies can be tested independently

### Concurrency Handling

Node.js is single-threaded but handles async operations concurrently. This can lead to race conditions when multiple async operations access shared state simultaneously.

**Solution: AsyncLock (Mutex)**
- Ensures only one async operation can access a critical section at a time
- Prevents race conditions in token consumption/refill
- Uses a queue-based locking mechanism

**Example Race Condition Without Lock:**
```typescript
// Without lock - RACE CONDITION!
async allowRequest() {
  if (tokens > 0) {        // Thread 1 checks: tokens = 1
    tokens--;              // Thread 2 checks: tokens = 1 (before Thread 1 decrements)
    return true;           // Both threads consume 1 token, but only 1 should be consumed!
  }
}
```

**With AsyncLock:**
```typescript
// With lock - SAFE!
async allowRequest() {
  return lock.execute(identifier, async () => {
    if (tokens > 0) {
      tokens--;            // Only one thread can execute this at a time
      return true;
    }
    return false;
  });
}
```

## Algorithms

### 1. Token Bucket Strategy

**How it works:**
- Tokens are added to a bucket at a fixed rate (refill rate)
- Each request consumes one token
- If bucket is empty, request is denied
- Bucket has a maximum capacity

**Use cases:**
- Smooth rate limiting
- Burst traffic handling
- API rate limiting

**Example:**
```typescript
const strategy = new TokenBucketStrategy(
  10,  // capacity: max 10 tokens
  2    // refillRate: 2 tokens per second
);
```

### 2. Fixed Window Strategy

**How it works:**
- Divides time into fixed windows (e.g., 1 minute, 1 hour)
- Each window has a maximum number of allowed requests
- Counter resets at the start of each new window

**Use cases:**
- Simple rate limiting
- Daily/monthly quotas
- Simple API limits

**Example:**
```typescript
const strategy = new FixedWindowStrategy(
  5,      // maxRequests: 5 requests
  10000   // windowSizeMs: per 10 seconds
);
```

### 3. Sliding Window Strategy

**How it works:**
- Maintains a log of request timestamps
- Only requests within the current window are counted
- Window slides forward with each request

**Use cases:**
- More accurate rate limiting than fixed window
- Prevents burst at window boundaries
- Better for distributed systems

**Example:**
```typescript
const strategy = new SlidingWindowStrategy(
  5,      // maxRequests: 5 requests
  10000   // windowSizeMs: in 10 second window
);
```

## Installation

```bash
npm install
npm run build
```

## Usage

### Basic Usage

```typescript
import { RateLimiter } from './src/RateLimiter';
import { TokenBucketStrategy } from './src/strategies/TokenBucketStrategy';

// Create a rate limiter with Token Bucket strategy
const strategy = new TokenBucketStrategy(10, 2); // 10 tokens, 2 per second
const rateLimiter = new RateLimiter(strategy);

// Check if request is allowed
const allowed = await rateLimiter.allowRequest('user-123');
if (allowed) {
  // Process request
} else {
  // Rate limited
}

// Get current state
const state = await rateLimiter.getState('user-123');
console.log(`Remaining: ${state.remainingRequests}`);
console.log(`Retry after: ${state.retryAfter} seconds`);
```

### Changing Strategy at Runtime

```typescript
// Start with Token Bucket
const rateLimiter = new RateLimiter(new TokenBucketStrategy(10, 2));

// Switch to Fixed Window
rateLimiter.setStrategy(new FixedWindowStrategy(5, 10000));

// Switch to Sliding Window
rateLimiter.setStrategy(new SlidingWindowStrategy(5, 10000));
```

### Concurrency Example

```typescript
import { RateLimiter } from './src/RateLimiter';
import { TokenBucketStrategy } from './src/strategies/TokenBucketStrategy';

const rateLimiter = new RateLimiter(new TokenBucketStrategy(10, 1));

// Make 20 concurrent requests
const promises = Array.from({ length: 20 }, () =>
  rateLimiter.allowRequest('user-123')
);

const results = await Promise.all(promises);
const allowedCount = results.filter(Boolean).length;

console.log(`Allowed: ${allowedCount}`); // Will be exactly 10 (bucket capacity)
```

## Running Examples

```bash
# Build the project
npm run build

# Run basic usage examples
npm start

# Run concurrency demo
npm run demo:concurrency
```

## Running Tests

```bash
npm test
```

## Project Structure

```
rate-limiter-poc/
├── src/
│   ├── interfaces/
│   │   └── RateLimiterStrategy.ts    # Strategy interface
│   ├── strategies/
│   │   ├── TokenBucketStrategy.ts    # Token Bucket implementation
│   │   ├── FixedWindowStrategy.ts     # Fixed Window implementation
│   │   └── SlidingWindowStrategy.ts   # Sliding Window implementation
│   ├── utils/
│   │   └── AsyncLock.ts               # Concurrency control (Mutex)
│   ├── RateLimiter.ts                 # Main RateLimiter class (Context)
│   ├── examples/
│   │   ├── basicUsage.ts              # Basic usage examples
│   │   └── concurrencyDemo.ts         # Concurrency demonstration
│   └── tests/
│       └── concurrency.test.ts        # Concurrency tests
├── package.json
└── README.md
```

## Concurrency Handling Details

### The Problem

In Node.js, even though it's single-threaded, async operations can interleave:

```typescript
// Request 1 (async)
const tokens = bucket.tokens;  // tokens = 5
// ... async operation happens ...
bucket.tokens = tokens - 1;    // tokens = 4

// Request 2 (async, concurrent)
const tokens = bucket.tokens;  // tokens = 5 (before Request 1 updates)
// ... async operation happens ...
bucket.tokens = tokens - 1;    // tokens = 4 (overwrites Request 1's update!)
```

Both requests see `tokens = 5` and both decrement, but only one token should be consumed.

### The Solution: AsyncLock

The `AsyncLock` class ensures that only one async operation can execute a critical section at a time:

```typescript
class AsyncLock {
  async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
    await this.waitForLock(key);  // Wait for lock
    this.acquireLock(key);        // Acquire lock
    try {
      return await fn();          // Execute critical section
    } finally {
      this.releaseLock(key);      // Release lock
    }
  }
}
```

### How It Works

1. **Queue-based locking**: Each identifier has a queue of waiting operations
2. **Sequential execution**: Operations execute one at a time per identifier
3. **Automatic cleanup**: Empty queues are removed to prevent memory leaks

## Design Patterns Used

1. **Strategy Pattern**: Interchangeable rate limiting algorithms
2. **Singleton Pattern**: One lock instance per strategy (implicit)
3. **Factory Pattern**: Strategy creation (can be extended)

## Future Enhancements

- Redis-backed storage for distributed systems
- Rate limiter middleware for Express.js
- More algorithms (Leaky Bucket, Adaptive Rate Limiting)
- Metrics and monitoring
- Configuration via environment variables

## License

MIT
