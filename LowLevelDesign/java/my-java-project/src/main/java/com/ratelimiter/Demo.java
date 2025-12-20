package com.ratelimiter;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Demo {
    public static void main(String[] args) {
        String userId = "123";
        runTokenBucketDemo(userId);
    }

    private static void runTokenBucketDemo(String userId) {
        int capacity = 5;
        int refillRate = 1; // 1 token per second

        // Directly create the TokenBucketRateLimiter
        TokenBucketRateLimiter rateLimiter = new TokenBucketRateLimiter(capacity, refillRate);

        ExecutorService executor = Executors.newFixedThreadPool(2);

        for (int i = 0; i < 10; i++) {
            executor.submit(() -> {
                boolean allowed = rateLimiter.allowRequest(userId);
                if (allowed) {
                    System.out.println("Request allowed for " + userId);
                } else {
                    System.out.println("Request rate-limited for " + userId);
                }
            });

            try {
                Thread.sleep(500); // simulate time between requests
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executor.shutdown();
    }
}
