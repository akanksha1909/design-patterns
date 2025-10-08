package com.ratelimiter.strategies;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class FixedWindowRateLimiter implements RateLimitingStrategy {
    private final int maxRequests;
    private final long windowSizeInMillis;
    private Map<String, UserRequestInfo> userRequests = new ConcurrentHashMap<>();

    public FixedWindowRateLimiter(Integer maxRequests, long windowSizeInSeconds) {
        this.maxRequests = maxRequests;
        this.windowSizeInMillis = 1000 * windowSizeInSeconds;
    }

    public boolean allowRequest(String userId) {
        long currentTime = System.currentTimeMillis();
        userRequests.putIfAbsent(userId, new UserRequestInfo(currentTime));
        UserRequestInfo userRequest = userRequests.get(userId);
        synchronized (userRequest) {
            if(currentTime - userRequest.windowStart >= windowSizeInMillis) {
                userRequest.reset(currentTime);
            }
            userRequest.requestCount.incrementAndGet();
            if(userRequest.requestCount.get() > maxRequests) {
                return false;
            }
            return true;
        }
    }

    private static class UserRequestInfo {
        long windowStart;
        AtomicInteger requestCount;

        UserRequestInfo(long startTime) {
            this.windowStart = startTime;
            this.requestCount = new AtomicInteger(0);
        }

        void reset(long newStart) {
            this.windowStart = newStart;
            this.requestCount.set(0);
        }
    }
}
