// Test to demonstrate the concurrency issue in TokenBucket

import { MutexLock } from './MutexLock.js';

class TokenBucket {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.userbuckets = new Map();
        this.refillRatePerSecond = refillRatePerSecond;
        this.mutex = new MutexLock();
    }
    
    async allowRequest(userId, requestCount) {
        // ISSUE 1: Sleep at the start delays everything, not simulating true concurrency
        await sleep(200)
        
        // ISSUE 2: Bucket creation happens OUTSIDE lock
        if(!this.userbuckets.has(userId)) {
            this.userbuckets.set(userId, new UserBucket(this.capacity, Date.now()))
        }
        const userbucket = this.userbuckets.get(userId)
        
        // ISSUE 3: Refill happens OUTSIDE lock - race condition!
        userbucket.refill(this.refillRatePerSecond)
        
        // ISSUE 4: Token check happens OUTSIDE lock - CRITICAL BUG!
        const tokens = userbucket.getTokens()
        
        if(tokens >= 1) {
            // ISSUE 5: Lock is only acquired AFTER the check passed
            // Multiple requests can all see tokens >= 1 and all proceed here!
            await this.mutex.execute(userId, async () => {
                console.log(`[Request ${requestCount}] ✅ Allowed - Tokens before decrement: ${userbucket.getTokens()}`);
                userbucket.decrementToken()
            })
        } else {
            console.log(`[Request ${requestCount}] ❌ Denied - Tokens: ${tokens}`);
        }
    }

    getUserToken(userId) {
        const userbucket = this.userbuckets.get(userId)
        return userbucket ? userbucket.getTokens() : 0;
    }
}

class UserBucket {
    constructor(capacity, lastRefillTime) {
        this.capacity = capacity;
        this.tokens = capacity;
        this.lastRefillTime = lastRefillTime;
    }
    
    getTokens() {
        return this.tokens
    }
    
    decrementToken() {
        this.tokens -= 1
    }
    
    refill(refillRatePerSecond) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - this.lastRefillTime;
        const tokensToAdd = (elapsedTime / 1000) * (refillRatePerSecond)
        if(tokensToAdd > 0) {
            this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd)
            this.lastRefillTime = currentTime;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("Testing concurrent requests WITHOUT proper locking...\n");
console.log("Starting 10 concurrent requests with capacity 5...\n");

const tokenBucket = new TokenBucket(5, 1)
const promises = []
for (let i = 0; i < 10; i++) {
    // Remove the sleep to simulate true concurrency
    promises.push(tokenBucket.allowRequest("userId-1", i + 1))
} 

await Promise.all(promises)
console.log(`\n📊 Final token count: ${tokenBucket.getUserToken("userId-1")}`);
console.log("⚠️  Problem: Multiple requests can all check tokens >= 1 simultaneously");
console.log("   before any lock is acquired, allowing more requests than capacity!");
