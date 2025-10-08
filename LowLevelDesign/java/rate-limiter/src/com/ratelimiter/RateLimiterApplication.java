package com.ratelimiter;

import com.ratelimiter.strategies.RateLimitingStrategy;

public class RateLimiterApplication {
    private static RateLimiterApplication instance;
    private RateLimitingStrategy rateLimitingStrategy;

    private RateLimiterApplication() {}

    public static synchronized RateLimiterApplication getInstance() {
        if(instance == null) {
            instance = new RateLimiterApplication();
        }
        return instance;
    }

    public void setRateLimitingStrategy(RateLimitingStrategy rateLimitingStrategy) {
        this.rateLimitingStrategy = rateLimitingStrategy;
    }

    public void handleRequest(String userId) {
        if (this.rateLimitingStrategy.allowRequest(userId)) {
            System.out.println("Request from user " + userId + " is allowed");
        } else {
            System.out.println("Request from user " + userId + " is rejected: Rate limit exceeded");
        }
    }
}
