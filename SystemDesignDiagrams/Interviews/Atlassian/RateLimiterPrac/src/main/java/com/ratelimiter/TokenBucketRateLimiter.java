package com.ratelimiter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TokenBucketRateLimiter {
    private final int capacity;
    private final int refillRate;
    private final Map<String, TokenBucket> userBuckets = new ConcurrentHashMap<>();
    public TokenBucketRateLimiter(int capacity, int refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
    }

    public boolean allowRequest(String userId) {
        long currentTime = System.currentTimeMillis();
        userBuckets.computeIfAbsent(userId, k -> new TokenBucket(capacity, refillRate, currentTime));
        TokenBucket bucket = userBuckets.get(userId);
        synchronized (bucket) {
            bucket.refill(currentTime);
            if(bucket.tokens > 0) {
                bucket.tokens -= 1;
                return true;
            } else {
                return false;
            }
        }
    }

    private static class TokenBucket {
        int refillRate;
        long lastRefillTime;
        int tokens;
        int capacity;

        TokenBucket(int capacity, int refillRate, long currentTimeInMillis) {
            this.capacity = capacity;
            this.refillRate = refillRate;
            this.lastRefillTime = currentTimeInMillis;
            this.tokens = capacity;
        }

        public void refill(long currentTimeInMillis) {
            long elaspsedTime = currentTimeInMillis - this.lastRefillTime;
            int tokensToAdd = (int)(elaspsedTime / 1000) * refillRate;
            if(tokensToAdd > 0 ) {
                this.tokens = Math.min(capacity, tokens + tokensToAdd);
                this.lastRefillTime = currentTimeInMillis;
            }
        }
    }
}
