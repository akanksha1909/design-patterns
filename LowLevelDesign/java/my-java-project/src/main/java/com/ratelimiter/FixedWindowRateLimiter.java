package com.ratelimiter;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

public class FixedWindowRateLimiter {
    private final int maxRequests;
    private final int windowSizeInMillis;
    private Map<String, UserRequestInfo> userRequests = new ConcurrentHashMap<>();

    public FixedWindowRateLimiter(int maxRequests, int windowSizeInSeconds) {
        this.maxRequests = maxRequests;
        this.windowSizeInMillis = windowSizeInSeconds*1000;
    }

    public boolean allowRequests(String userId) {
        long now = System.currentTimeMillis();
        userRequests.putIfAbsent(userId, new UserRequestInfo(now));
        UserRequestInfo userRequest = userRequests.get(userId);

        synchronized (userRequest) {
            if(now - userRequest.windowStart >= windowSizeInMillis) {
                userRequest.reset(now);
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

        void reset(long currentTime) {
            this.windowStart = currentTime;
            this.requestCount.set(0);
        }
    }
}
