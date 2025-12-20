package com.ratelimiter.strategies;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class SlidingWindowCounterRateLimiter implements RateLimitingStrategy {

    private final int maxRequests;
    private final long windowSizeInMillis;

    private final Map<String, UserWindow> userWindows = new ConcurrentHashMap<>();

    public SlidingWindowCounterRateLimiter(int maxRequests, int windowSizeInSeconds) {
        this.maxRequests = maxRequests;
        this.windowSizeInMillis = windowSizeInSeconds * 1000L;
    }

    @Override
    public boolean allowRequest(String userId) {
        userWindows.putIfAbsent(userId, new UserWindow(windowSizeInMillis));
        UserWindow window = userWindows.get(userId);

        synchronized (window) {
            return window.allow(now(), maxRequests, windowSizeInMillis, userId);
        }
    }

    private long now() {
        return System.currentTimeMillis();
    }

    // ----------------------------------------------------------
    // Inner Class Representing Per-User Time Windows
    // ----------------------------------------------------------
    private static class UserWindow {
        long currentWindowStart;
        int currentWindowCount;

        long prevWindowStart;
        int prevWindowCount;

        UserWindow(long windowSizeInMillis) {
            long now = System.currentTimeMillis();
            currentWindowStart = now;
            prevWindowStart = now - windowSizeInMillis;
        }

        boolean allow(long now, int maxRequests, long windowSizeInMillis, String userId) {
            slideWindowIfNeeded(now, windowSizeInMillis);

            // Calculate overlap ratio
            double timeIntoWindow = now - currentWindowStart;
            double overlapRatio = 1.0 - (timeIntoWindow / windowSizeInMillis);
            overlapRatio = Math.max(0, overlapRatio);

            // Weighted count
            double effectiveCount =
                    currentWindowCount + (prevWindowCount * overlapRatio);

            if (effectiveCount < maxRequests) {
                currentWindowCount++;
                System.out.println("Allowed → " + userId + " | effective=" + effectiveCount);
                return true;
            }

            System.out.println("Denied → " + userId + " | effective=" + effectiveCount);
            return false;
        }

        private void slideWindowIfNeeded(long now, long windowSizeInMillis) {
            long elapsed = now - currentWindowStart;

            // Full slide
            if (elapsed >= windowSizeInMillis) {
                prevWindowStart = currentWindowStart;
                prevWindowCount = currentWindowCount;

                currentWindowStart = now;
                currentWindowCount = 0;
            }
        }
    }
}
