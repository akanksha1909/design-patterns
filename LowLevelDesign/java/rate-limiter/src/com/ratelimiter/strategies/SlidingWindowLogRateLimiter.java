package com.ratelimiter.strategies;

import java.util.Map;
import java.util.Deque;
import java.util.LinkedList;
import java.util.concurrent.ConcurrentHashMap;

public class SlidingWindowLogRateLimiter implements RateLimitingStrategy {

    private final int maxRequests;
    private final long windowSizeInMillis;

    // User → List of request timestamps
    private final Map<String, Deque<Long>> userLogs = new ConcurrentHashMap<>();

    public SlidingWindowLogRateLimiter(int maxRequests, int windowSizeInSeconds) {
        this.maxRequests = maxRequests;
        this.windowSizeInMillis = windowSizeInSeconds * 1000L;
    }

    @Override
    public boolean allowRequest(String userId) {
        // "A123" -> [1000, 2500, 9000]
        userLogs.putIfAbsent(userId, new LinkedList<>());
        Deque<Long> timestamps = userLogs.get(userId);

        long now = System.currentTimeMillis();
        long windowStart = now - windowSizeInMillis;

        synchronized (timestamps) {
            // Remove old timestamps outside window
            while (!timestamps.isEmpty() && timestamps.peekFirst() < windowStart) {
                timestamps.pollFirst();
            }

            // If under limit → allow
            if (timestamps.size() < maxRequests) {
                timestamps.addLast(now);
                System.out.println("Allowed → " + userId + " | count=" + timestamps.size());
                return true;
            }

            // Otherwise → deny
            System.out.println("Denied → " + userId + " | count=" + timestamps.size());
            return false;
        }
    }
}
