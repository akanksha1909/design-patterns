// Advanced demo showing concurrency issues with realistic timing

class TokenBucket {
    constructor(capacity, refillRatePerSecond) {
        this.capacity = capacity;
        this.userbuckets = new Map();
        this.refillRatePerSecond = refillRatePerSecond;
    }
    
    allowRequest(userId, requestCount) {
        if(!this.userbuckets.has(userId)) {
            this.userbuckets.set(userId, new UserBucket(this.capacity, Date.now()))
        }
        const userbucket = this.userbuckets.get(userId)
        userbucket.refill(this.refillRatePerSecond)
        const tokens = userbucket.getTokens()
        if(tokens >= 1) {
            console.log(`[Request ${requestCount}] ✅ Allowed - Tokens: ${tokens.toFixed(2)}`);
            userbucket.decrementToken()
        } else {
            console.log(`[Request ${requestCount}] ❌ Denied - Tokens: ${tokens.toFixed(2)}`);
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
// DEMO: Race Condition with Timing Variations
// ============================================
console.log("\n" + "=".repeat(70));
console.log("ADVANCED DEMO: Race Condition with Realistic Timing");
console.log("=".repeat(70));
console.log("\nThis demo simulates concurrent requests with small random delays");
console.log("to better demonstrate the check-then-act race condition.\n");

async function simulateConcurrentRequests() {
    const bucket = new TokenBucket(5, 1);
    const userId = "user-concurrent";
    
    console.log("Starting 8 concurrent requests with bucket capacity of 5...");
    console.log("Each request has a small random delay to simulate real-world timing.\n");
    
    const requestLog = [];
    
    // Create requests with random micro-delays to simulate real concurrency
    const promises = [];
    for (let i = 1; i <= 8; i++) {
        promises.push(
            new Promise(resolve => {
                // Random delay between 0-5ms to simulate network/processing time
                const delay = Math.random() * 5;
                setTimeout(() => {
                    const tokensBefore = bucket.userbuckets.has(userId) 
                        ? bucket.userbuckets.get(userId).getTokens() 
                        : 5;
                    
                    // CRITICAL: This is where the race condition occurs
                    // Multiple requests might read the same token value here
                    bucket.allowRequest(userId, i);
                    
                    const tokensAfter = bucket.userbuckets.get(userId).getTokens();
                    
                    requestLog.push({
                        requestId: i,
                        tokensBefore: tokensBefore,
                        tokensAfter: tokensAfter,
                        delay: delay.toFixed(2)
                    });
                    
                    resolve();
                }, delay);
            })
        );
    }
    
    await Promise.all(promises);
    
    // Sort by delay to show execution order
    requestLog.sort((a, b) => parseFloat(a.delay) - parseFloat(b.delay));
    
    console.log("\n📊 Request Execution Timeline:");
    console.log("-".repeat(70));
    console.log("Request | Delay(ms) | Tokens Before | Tokens After | Status");
    console.log("-".repeat(70));
    
    let allowedCount = 0;
    requestLog.forEach(log => {
        const wasAllowed = log.tokensAfter < log.tokensBefore;
        if (wasAllowed) allowedCount++;
        const status = wasAllowed ? "✅ Allowed" : "❌ Denied";
        console.log(`   ${log.requestId}   |   ${log.delay.padStart(5)}  |      ${log.tokensBefore.toFixed(2)}      |     ${log.tokensAfter.toFixed(2)}     | ${status}`);
    });
    
    const finalTokens = bucket.userbuckets.get(userId).getTokens();
    console.log("-".repeat(70));
    console.log(`\n📈 Summary:`);
    console.log(`   Total Requests: 8`);
    console.log(`   Requests Allowed: ${allowedCount}`);
    console.log(`   Final Token Count: ${finalTokens.toFixed(2)}`);
    
    if (allowedCount > 5) {
        console.log(`\n⚠️  RACE CONDITION DETECTED!`);
        console.log(`   Expected: Maximum 5 requests allowed (bucket capacity)`);
        console.log(`   Actual: ${allowedCount} requests allowed`);
        console.log(`   Problem: Multiple requests read tokens >= 1 simultaneously`);
        console.log(`            and all decremented before the state was updated.`);
    } else if (finalTokens < 0) {
        console.log(`\n⚠️  RACE CONDITION DETECTED!`);
        console.log(`   Tokens went negative: ${finalTokens.toFixed(2)}`);
        console.log(`   Problem: More decrements occurred than available tokens.`);
    } else {
        console.log(`\n✅ No race condition detected in this run (may occur with different timing)`);
        console.log(`   Note: Race conditions are non-deterministic and may not`);
        console.log(`   appear in every execution due to timing variations.`);
    }
}

// ============================================
// DEMO: Detailed Step-by-Step Race Condition
// ============================================
console.log("\n" + "=".repeat(70));
console.log("DETAILED DEMO: Step-by-Step Race Condition Explanation");
console.log("=".repeat(70));

async function detailedRaceConditionDemo() {
    const bucket = new TokenBucket(2, 1); // Small capacity for clarity
    const userId = "user-detail";
    
    console.log("\nScenario: 3 concurrent requests arrive when bucket has 2 tokens");
    console.log("Expected: Only 2 requests should be allowed\n");
    
    // Manually create bucket with 2 tokens
    bucket.userbuckets.set(userId, new UserBucket(2, Date.now()));
    bucket.userbuckets.get(userId).tokens = 2;
    
    console.log("Initial state: 2 tokens available\n");
    
    // Simulate the race condition step by step
    const userBucket = bucket.userbuckets.get(userId);
    
    console.log("Request 1 executes:");
    console.log("  1. Reads tokens: " + userBucket.getTokens());
    console.log("  2. Checks: tokens >= 1? " + (userBucket.getTokens() >= 1));
    console.log("  3. Decrements: " + userBucket.getTokens() + " -> " + (userBucket.getTokens() - 1));
    userBucket.decrementToken();
    console.log("  ✅ Allowed (tokens now: " + userBucket.getTokens() + ")\n");
    
    console.log("Request 2 executes (concurrently with Request 3):");
    console.log("  1. Reads tokens: " + userBucket.getTokens());
    console.log("  2. Checks: tokens >= 1? " + (userBucket.getTokens() >= 1));
    console.log("  3. Decrements: " + userBucket.getTokens() + " -> " + (userBucket.getTokens() - 1));
    userBucket.decrementToken();
    console.log("  ✅ Allowed (tokens now: " + userBucket.getTokens() + ")\n");
    
    console.log("Request 3 executes (concurrently with Request 2):");
    console.log("  ⚠️  PROBLEM: Request 3 might have read tokens BEFORE Request 2 decremented!");
    console.log("  1. Reads tokens: " + (userBucket.tokens + 1)); // Show what it might have read
    console.log("  2. Checks: tokens >= 1? true (but tokens were already decremented by Request 2)");
    console.log("  3. Decrements anyway: " + userBucket.getTokens() + " -> " + (userBucket.getTokens() - 1));
    userBucket.decrementToken();
    console.log("  ⚠️  Allowed (but shouldn't be! tokens now: " + userBucket.getTokens() + ")\n");
    
    console.log("📊 Final Result:");
    console.log("  Tokens: " + userBucket.getTokens());
    console.log("  Requests Allowed: 3 (but should be only 2!)");
    console.log("\n💡 The issue: The check (tokens >= 1) and decrement are NOT atomic.");
    console.log("   Multiple requests can pass the check before any decrement happens.");
}

// ============================================
// Run demos
// ============================================
(async () => {
    await simulateConcurrentRequests();
    await new Promise(resolve => setTimeout(resolve, 1000));
    await detailedRaceConditionDemo();
    
    console.log("\n" + "=".repeat(70));
    console.log("KEY CONCURRENCY ISSUES IDENTIFIED:");
    console.log("=".repeat(70));
    console.log("\n1. CHECK-THEN-ACT RACE CONDITION:");
    console.log("   - Multiple threads can read tokens >= 1 simultaneously");
    console.log("   - All threads pass the check before any decrement occurs");
    console.log("   - Result: More requests allowed than capacity");
    console.log("\n2. NON-ATOMIC OPERATIONS:");
    console.log("   - getTokens() and decrementToken() are separate operations");
    console.log("   - No synchronization between read and write");
    console.log("   - Result: Lost updates and inconsistent state");
    console.log("\n3. REFILL RACE CONDITION:");
    console.log("   - Multiple refills can read same token value");
    console.log("   - Each calculates new value independently");
    console.log("   - Last write wins, losing previous updates");
    console.log("\n💡 SOLUTIONS:");
    console.log("   - Use mutex locks (like your MutexLock.js)");
    console.log("   - Make critical sections atomic");
    console.log("   - Use atomic operations for check-and-decrement");
    console.log("=".repeat(70) + "\n");
})();
