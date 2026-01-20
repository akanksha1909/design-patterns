import { MutexLock } from '../MutexLock.js'

// refillRatePerSecond: 1 token per second
class TokenBucket {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.userbuckets = new Map();
        this.refillRatePerSecond = refillRatePerSecond;
        this.mutex = new MutexLock();
    }
    
    async allowRequest(userId, requestCount) {
        // Wrap the entire critical section in the lock
        // This ensures check, refill, and decrement are atomic
        return await this.mutex.execute(userId, async () => {
            // Create bucket if it doesn't exist (inside lock to prevent race condition)
            if(!this.userbuckets.has(userId)) {
                this.userbuckets.set(userId, new UserBucket(this.capacity, Date.now()))
            }
            const userbucket = this.userbuckets.get(userId)
            
            // Refill tokens (inside lock to prevent race condition)
            userbucket.refill(this.refillRatePerSecond)
            
            // Check tokens and decrement atomically (inside lock)
            const tokens = userbucket.getTokens()
            if(tokens >= 1) {
                console.log(`Request ${requestCount}: ✅ Allowed (tokens before: ${tokens.toFixed(2)})`);
                userbucket.decrementToken()
                return true;
            } else {
                console.log(`Request ${requestCount}: ❌ Denied (tokens: ${tokens.toFixed(2)})`);
                return false;
            }
        })
    }

    getUserToken(userId) {
        const userbucket = this.userbuckets.get(userId)
        return userbucket ? userbucket.getTokens() : this.capacity
 
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

const tokenBucket = new TokenBucket(5, 1)
console.log("Starting requests with 200ms delay between each...\n")
console.log("Initial tokens:", tokenBucket.getUserToken("userId-1"))
console.log("Capacity: 5, Refill rate: 1 token/second\n")

// Send requests sequentially with 200ms delay to observe refill
for (let i = 0; i < 20; i++) {
    await tokenBucket.allowRequest("userId-1", i + 1)
    const currentTokens = tokenBucket.getUserToken("userId-1")
    console.log(`  → Tokens remaining: ${currentTokens.toFixed(2)}\n`)
    await sleep(200); // 200ms delay between requests
} 

console.log("\nFinal token count:", tokenBucket.getUserToken("userId-1").toFixed(2))


// | Time (sec) | Tokens before request | Request arrives? | Token used | Tokens after | Allowed / Rejected |
// | ---------- | --------------------- | ---------------- | ---------- | ------------ | ------------------ |
// | 0.0        | 5                     | ✅ Yes            | -1         | 4            | ✅ Allowed          |
// | 0.2        | 4                     | ✅ Yes            | -1         | 3            | ✅ Allowed          |
// | 0.4        | 3                     | ✅ Yes            | -1         | 2            | ✅ Allowed          |
// | 0.6        | 2                     | ✅ Yes            | -1         | 1            | ✅ Allowed          |
// | 0.8        | 1                     | ✅ Yes            | -1         | 0            | ✅ Allowed          |
// | **1.0**    | **+1 token refilled** | —                 | —          | **1**        | —                  |
// | 1.2        | 1                     | ✅ Yes            | -1         | 0            | ✅ Rejected          |
// | 1.4        | 1                     | ✅ Yes            | -1         | 0            | ✅ Rejected          |
// | 1.6        | 1                     | ✅ Yes            | -1         | 0            | ✅ Rejected          |
// | 1.8        | 1                     | ✅ Yes            | -1         | 0            | ✅ Rejected          |
// | **2.0**    | **+1 token refilled** | —                | —          | **1**        | —                   |

