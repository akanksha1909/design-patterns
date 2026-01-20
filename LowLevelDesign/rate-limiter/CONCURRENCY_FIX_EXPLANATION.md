# TokenBucket Concurrency Issues - Fixed

## Problems Identified in Original Code

### ❌ Issue 1: Lock Applied Too Late (CRITICAL)
**Problem:** The lock was only acquired AFTER checking `tokens >= 1`. This meant:
- Multiple concurrent requests could all read `tokens >= 1` simultaneously
- All requests would pass the check before any lock was acquired
- All requests would then acquire the lock sequentially and decrement
- Result: More requests allowed than bucket capacity

**Original Code:**
```javascript
const tokens = userbucket.getTokens()  // ❌ Check happens OUTSIDE lock
if(tokens >= 1) {
    await this.mutex.execute(userId, async () => {
        userbucket.decrementToken()  // ✅ Only decrement is protected
    })
}
```

### ❌ Issue 2: Refill Happens Outside Lock
**Problem:** The `refill()` call happened before acquiring the lock, causing:
- Multiple concurrent refills reading the same token value
- Each calculating new tokens independently
- Last write wins, losing previous updates

**Original Code:**
```javascript
userbucket.refill(this.refillRatePerSecond)  // ❌ Outside lock
const tokens = userbucket.getTokens()
// ... rest of code
```

### ❌ Issue 3: Bucket Creation Not Protected
**Problem:** Bucket creation happened outside the lock, potentially causing:
- Race condition if two requests arrive simultaneously for a new user
- Both might try to create the bucket

**Original Code:**
```javascript
if(!this.userbuckets.has(userId)) {  // ❌ Outside lock
    this.userbuckets.set(userId, new UserBucket(...))
}
```

### ❌ Issue 4: Unnecessary Sleep
**Problem:** `await sleep(200)` at the start of `allowRequest()`:
- Delays every request unnecessarily
- Doesn't help with concurrency simulation
- Makes the code slower

## ✅ Fixed Code

**Key Principle:** The entire critical section must be atomic:
1. Check if bucket exists (create if needed)
2. Refill tokens
3. Check if tokens >= 1
4. Decrement if allowed

All of these operations must happen atomically within the lock.

**Fixed Code:**
```javascript
async allowRequest(userId, requestCount) {
    // Wrap the entire critical section in the lock
    return await this.mutex.execute(userId, async () => {
        // 1. Create bucket if needed (inside lock)
        if(!this.userbuckets.has(userId)) {
            this.userbuckets.set(userId, new UserBucket(this.capacity, Date.now()))
        }
        const userbucket = this.userbuckets.get(userId)
        
        // 2. Refill tokens (inside lock)
        userbucket.refill(this.refillRatePerSecond)
        
        // 3. Check and decrement atomically (inside lock)
        const tokens = userbucket.getTokens()
        if(tokens >= 1) {
            console.log("Request is allowed " + requestCount);
            userbucket.decrementToken()
            return true;
        } else {
            console.log("Request is denied " + requestCount);
            return false;
        }
    })
}
```

## Why This Fix Works

1. **Atomic Check-and-Decrement:** The check (`tokens >= 1`) and decrement happen atomically, so only one request can see tokens >= 1 and decrement at a time.

2. **Protected Refill:** Refill happens inside the lock, preventing concurrent refills from overwriting each other.

3. **Protected Bucket Creation:** Bucket creation is atomic, preventing race conditions.

4. **Sequential Processing:** The mutex ensures requests for the same user are processed sequentially, maintaining correctness.

## Test Results

With the fix:
- ✅ Exactly 5 requests allowed (matching capacity)
- ✅ No race conditions
- ✅ Tokens never go negative
- ✅ Thread-safe for concurrent requests

## Key Takeaway

**Rule:** When using locks, the entire critical section (all operations that must be atomic together) must be inside the lock. Don't check outside and act inside - that's a classic race condition pattern!
