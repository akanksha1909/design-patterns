package com.ratelimiter.strategies;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class LeakyBucketRateLimiter implements RateLimitingStrategy {

    private final int capacity;               // Max water units
    private final double leakRatePerSec;      // Leak speed
    private final Map<String, UserBucket> userBuckets = new ConcurrentHashMap<>();

    public LeakyBucketRateLimiter(int capacity, double leakRatePerSec) {
        this.capacity = capacity;
        this.leakRatePerSec = leakRatePerSec;
    }

    @Override
    public boolean allowRequest(String userId) {
        userBuckets.putIfAbsent(userId, new UserBucket(capacity, leakRatePerSec));
        UserBucket bucket = userBuckets.get(userId);

        synchronized (bucket) {   // locking per-user bucket only
            bucket.leak();        // perform leak first

            if (bucket.currentWaterLevel < capacity) {
                bucket.currentWaterLevel += 1;   // add request
                System.out.println("Allowed -> " + userId + " | level=" + bucket.currentWaterLevel);
                return true;
            }

            System.out.println("Denied -> " + userId + " | Bucket FULL");
            return false;
        }
    }

    // ---------------------
    // Inner class per user
    // ---------------------
    private static class UserBucket {
        final int capacity;
        final double leakRate;
        double currentWaterLevel = 0.0;
        long lastLeakTimestamp;

        UserBucket(int capacity, double leakRate) {
            this.capacity = capacity;
            this.leakRate = leakRate;
            this.lastLeakTimestamp = System.currentTimeMillis();
        }

        void leak() {
            long now = System.currentTimeMillis();
            double elapsed = (now - lastLeakTimestamp) / 1000.0;  // seconds
            double leaked = elapsed * leakRate;

            if (leaked > 0) {
                currentWaterLevel = Math.max(0, currentWaterLevel - leaked);
                lastLeakTimestamp = now;
            }
        }
    }
}
