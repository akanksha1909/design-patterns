package com.ratelimiter;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenBucketRateLimiterTest {

    private TokenBucketRateLimiter rateLimiter;
    private final String userId = "user1";

    @BeforeEach
    void setUp() {
        int capacity = 3;      // max 3 tokens
        int refillRate = 1;    // 1 token per second
        rateLimiter = new TokenBucketRateLimiter(capacity, refillRate);
    }

    @Test
    void testAllowRequestWithinCapacity() {
        // All 3 requests should be allowed immediately
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(userId));
    }

    @Test
    void testDenyRequestWhenExceedCapacity() {
        // Use up all tokens
        rateLimiter.allowRequest(userId);
        rateLimiter.allowRequest(userId);
        rateLimiter.allowRequest(userId);

        // Next request should be denied
        assertFalse(rateLimiter.allowRequest(userId));
    }

    @Test
    void testRefillTokensOverTime() throws InterruptedException {
        // Use up all tokens
        rateLimiter.allowRequest(userId);
        rateLimiter.allowRequest(userId);
        rateLimiter.allowRequest(userId);

        // Wait 2 seconds to allow 2 tokens to refill
        Thread.sleep(2100);

        // Now 2 requests should be allowed
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(userId));

        // Next request should be denied (only 2 tokens refilled)
        assertFalse(rateLimiter.allowRequest(userId));
    }

    @Test
    void testMultipleUsersIndependentBuckets() throws InterruptedException {
        String user2 = "user2";

        // Each user has their own bucket
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(user2));
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(userId));
        assertTrue(rateLimiter.allowRequest(user2));
        assertTrue(rateLimiter.allowRequest(user2));
        Thread.sleep(2100);

        assertTrue(rateLimiter.allowRequest(user2));
    }
}
