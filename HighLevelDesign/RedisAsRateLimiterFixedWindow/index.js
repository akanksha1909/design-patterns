const Redis = require('ioredis');
const redis = new Redis();

async function isAllowed(userId, limit = 5, windowSec = 60) {
    const key = `rate_limit:${userId}`;

    const current = await redis.incr(key);
    if (current == 1) {
        await redis.expire(key, windowSec)
    }

    return current <= limit

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    const userId = "user_123";

    for (let i = 0; i < 10; i++) {
        const allowed = await isAllowed(userId, 5, 60);
        console.log(`Request ${i + 1}:`, allowed ? "✅ Allowed" : "❌ Blocked");
        await sleep(8000); // Wait for 1 second
    }

    process.exit();
})();
