// A bucket has a capacity
// refillInterval

class TokenBucket {
    constructor(capacity, refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
        this.lastRefillTimeStamp = new Date();
        this.tokens = this.capacity;
    }

    allowToken(requestCount) {
        this.refill()
        if (this.tokens >= 1) {
            console.log("Request is allowed " + requestCount);
            this.tokens -= 1
        } else {
            console.log("Request is rejected " + requestCount);
        }
    }

    refill() {
        let currentTime = new Date();
        let elapsedSeconds = Math.floor((currentTime - this.lastRefillTimeStamp) / 1000);
        let tokensToAdd = elapsedSeconds * this.refillRate;
        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.tokens + tokensToAdd, this.capacity);
            this.lastRefillTimeStamp = currentTime;
        }
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Capacity: 5 tokens 
// Refill Rate: 1 token per second
const bucket = new TokenBucket(5, 1)
for (let i = 0; i < 20; i++) {
    bucket.allowToken(i + 1)
    await sleep(200);
}

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

