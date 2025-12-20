package com.ratelimiter;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class FixedWindowRateLimiterTest {
    private FixedWindowRateLimiter rateLimiter;
    @BeforeEach
    public void setUp() {
        int maxRequests = 3;
        int windowInSeconds = 10;
        rateLimiter = new FixedWindowRateLimiter(maxRequests, windowInSeconds);
    }

    @Test
    public void testAllowRequestWithinLimit() {
        String userId = "123";
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
    }

    @Test
    public void testDenyWhenRequestsExceeds() {
        String userId = "123";
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
        assertFalse(rateLimiter.allowRequests(userId));
        assertFalse(rateLimiter.allowRequests(userId));
    }

    @Test
    public void testResetOverTime() throws InterruptedException {
        String userId = "123";
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
        assertTrue(rateLimiter.allowRequests(userId));
        assertFalse(rateLimiter.allowRequests(userId));

        Thread.sleep(10*1000);
        assertTrue(rateLimiter.allowRequests(userId));

    }

    @Test
    public void testMultipleUserIndependentBuckets() throws InterruptedException {
        assertTrue(rateLimiter.allowRequests("123"));
        assertTrue(rateLimiter.allowRequests("124"));
        assertTrue(rateLimiter.allowRequests("123"));
        assertTrue(rateLimiter.allowRequests("124"));
        assertTrue(rateLimiter.allowRequests("123"));
        assertTrue(rateLimiter.allowRequests("124"));
    }
}
