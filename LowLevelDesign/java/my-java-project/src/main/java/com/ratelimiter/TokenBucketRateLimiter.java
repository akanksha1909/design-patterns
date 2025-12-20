package com.ratelimiter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class TokenBucketRateLimiter {
    private final Integer capacity;
    private final Integer refillRate;
    private final Map<String, TokenBucket> userBuckets = new ConcurrentHashMap<>();

    public TokenBucketRateLimiter(Integer capacity, Integer refillRate) {
        this.capacity = capacity;
        this.refillRate = refillRate;
    }

    public boolean allowRequest(String userId) {
        long currentTime = System.currentTimeMillis();
        userBuckets.putIfAbsent(userId, new TokenBucket(this.capacity, this.refillRate, currentTime));
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
        final Integer capacity;
        final Integer refillRatePerSecond;
        long lastRefillTime;
        Integer tokens;

        TokenBucket(Integer capacity, Integer refillRatePerSecond, long currentTimeMillis) {
            this.capacity = capacity;
            this.refillRatePerSecond = refillRatePerSecond;
            this.tokens = capacity;
            this.lastRefillTime = currentTimeMillis;
        }


        public void refill(long currentTime) {
            long elapsedTime = currentTime - this.lastRefillTime;
            Integer tokensToAdd = (int) (elapsedTime / 1000)* refillRatePerSecond;
            if(tokensToAdd > 0) {
                tokens = Math.min(capacity, tokens + tokensToAdd);
                lastRefillTime = currentTime;
            }
        }
    }
}
