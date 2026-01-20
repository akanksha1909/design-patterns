// Demo showing concurrency issues in TokenBucket

// Copy of the original TokenBucket (without fixes)
class TokenBucket {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.userbuckets = new Map();
        this.refillRatePerSecond = refillRatePerSecond;
    }
    
    async allowRequest(userId, requestCount) {
        if(!this.userbuckets.has(userId)) {
            this.userbuckets.set(userId, new UserBucket(this.capacity, Date.now()))
        }
        const userbucket = this.userbuckets.get(userId)
        userbucket.refill(this.refillRatePerSecond)
        const tokens = userbucket.getTokens()
        if(tokens >= 1) {
            console.log(`[Request ${requestCount}] ✅ Allowed - Tokens: ${tokens}`);
            await sleep(1000);
            userbucket.decrementToken()
        } else {
            console.log(`[Request ${requestCount}] ❌ Denied - Tokens: ${tokens}`);
        }
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

// ============================================
// DEMO 1: Race Condition - Check-Then-Act
// ============================================
console.log("\n" + "=".repeat(60));
console.log("DEMO 1: Race Condition in Check-Then-Act Pattern");
console.log("=".repeat(60));
console.log("Issue: Multiple requests can read tokens >= 1 simultaneously,");
console.log("       then all decrement, allowing more requests than capacity.\n");

async function demo1_RaceCondition() {
    const bucket = new TokenBucket(5, 1);
    const userId = "user-1";
    
    // Simulate 10 concurrent requests when bucket has only 5 tokens
    console.log("Starting 10 concurrent requests with bucket capacity of 5...\n");
    
    const promises = [];
    for (let i = 1; i <= 10; i++) {
        promises.push(
            Promise.resolve().then(() => {
                // Simulate concurrent access (no delay)
                bucket.allowRequest(userId, i);
            })
        );
    }
    
    await Promise.all(promises);
    
    const finalTokens = bucket.userbuckets.get(userId).getTokens();
    console.log(`\n📊 Final token count: ${finalTokens}`);
    console.log(`⚠️  Expected: Should be >= 0, but might be negative!`);
    console.log(`⚠️  Problem: Multiple requests saw tokens >= 1 and all decremented.`);
}

// ============================================
// DEMO 2: Race Condition - Refill Method
// ============================================
console.log("\n" + "=".repeat(60));
console.log("DEMO 2: Race Condition in Refill Method");
console.log("=".repeat(60));
console.log("Issue: Concurrent refill calls can read the same token value,");
console.log("       calculate independently, and overwrite each other.\n");

async function demo2_RefillRaceCondition() {
    const bucket = new TokenBucket(5, 1);
    const userId = "user-2";
    
    // Start with 0 tokens
    const userBucket = new UserBucket(5, Date.now() - 2000); // 2 seconds ago
    userBucket.tokens = 0;
    bucket.userbuckets.set(userId, userBucket);
    
    console.log("Starting with 0 tokens, simulating 2 seconds elapsed...");
    console.log("Expected: Should refill 2 tokens (1 per second)\n");
    
    // Simulate concurrent refill calls
    const promises = [];
    for (let i = 1; i <= 5; i++) {
        promises.push(
            Promise.resolve().then(() => {
                const ub = bucket.userbuckets.get(userId);
                const before = ub.getTokens();
                ub.refill(1); // 1 token per second
                const after = ub.getTokens();
                console.log(`[Refill ${i}] Before: ${before}, After: ${after}`);
            })
        );
    }
    
    await Promise.all(promises);
    
    const finalTokens = bucket.userbuckets.get(userId).getTokens();
    console.log(`\n📊 Final token count: ${finalTokens}`);
    console.log(`⚠️  Expected: ~2 tokens (refilled once)`);
    console.log(`⚠️  Problem: Multiple refills might have overwritten each other.`);
}

// ============================================
// DEMO 3: Race Condition - Bucket Creation
// ============================================
console.log("\n" + "=".repeat(60));
console.log("DEMO 3: Race Condition in Bucket Creation");
console.log("=".repeat(60));
console.log("Issue: Two concurrent requests might both see bucket doesn't exist");
console.log("       and both try to create it (though Map.set is atomic, this shows the pattern).\n");

async function demo3_BucketCreation() {
    const bucket = new TokenBucket(5, 1);
    const userId = "user-3";
    
    console.log("Simulating concurrent first requests for new user...\n");
    
    // Simulate concurrent first requests
    const promises = [];
    for (let i = 1; i <= 3; i++) {
        promises.push(
            Promise.resolve().then(() => {
                const before = bucket.userbuckets.has(userId);
                bucket.allowRequest(userId, i);
                const after = bucket.userbuckets.has(userId);
                console.log(`[Request ${i}] Bucket existed before: ${before}, after: ${after}`);
            })
        );
    }
    
    await Promise.all(promises);
    
    console.log(`\n📊 Total buckets created: ${bucket.userbuckets.size}`);
    console.log(`⚠️  Note: Map operations are atomic, but the check-then-act pattern`);
    console.log(`⚠️  still shows the conceptual race condition.`);
}

// ============================================
// DEMO 4: Real-World Scenario - Token Leakage
// ============================================
console.log("\n" + "=".repeat(60));
console.log("DEMO 4: Real-World Scenario - Token Leakage");
console.log("=".repeat(60));
console.log("Issue: Under high concurrency, tokens can go negative or");
console.log("       more requests can be allowed than the bucket capacity.\n");

async function demo4_TokenLeakage() {
    const bucket = new TokenBucket(5, 1);
    const userId = "user-4";
    
    console.log("Simulating 20 rapid concurrent requests with capacity 5...\n");
    
    const results = { allowed: 0, denied: 0 };
    const promises = [];
    
    for (let i = 1; i <= 20; i++) {
        promises.push(
            Promise.resolve().then(() => {
                const tokensBefore = bucket.userbuckets.has(userId) 
                    ? bucket.userbuckets.get(userId).getTokens() 
                    : 5;
                
                bucket.allowRequest(userId, i);
                
                const tokensAfter = bucket.userbuckets.get(userId).getTokens();
                
                if (tokensAfter < tokensBefore) {
                    results.allowed++;
                } else {
                    results.denied++;
                }
            })
        );
    }
    
    await Promise.all(promises);
    
    const finalTokens = bucket.userbuckets.get(userId).getTokens();
    console.log(`\n📊 Results:`);
    console.log(`   Allowed: ${results.allowed}`);
    console.log(`   Denied: ${results.denied}`);
    console.log(`   Final tokens: ${finalTokens}`);
    console.log(`\n⚠️  Expected: Only 5 requests should be allowed`);
    console.log(`⚠️  Problem: More than 5 requests might be allowed due to race conditions!`);
    if (finalTokens < 0) {
        console.log(`⚠️  CRITICAL: Tokens went negative: ${finalTokens}`);
    }
}

// ============================================
// Run all demos
// ============================================
(async () => {
    await demo1_RaceCondition();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await demo2_RefillRaceCondition();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await demo3_BucketCreation();
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    await demo4_TokenLeakage();
    
    console.log("\n" + "=".repeat(60));
    console.log("SUMMARY OF CONCURRENCY ISSUES:");
    console.log("=".repeat(60));
    console.log("1. Check-Then-Act Race: Reading tokens and decrementing are not atomic");
    console.log("2. Refill Race: Multiple refills can overwrite each other's updates");
    console.log("3. Bucket Creation: Check-then-act pattern in bucket initialization");
    console.log("4. Token Leakage: Under concurrency, more requests allowed than capacity");
    console.log("\n💡 Solution: Use mutex locks or atomic operations to make");
    console.log("   the critical sections (check + decrement, refill) atomic.");
    console.log("=".repeat(60) + "\n");
})();
