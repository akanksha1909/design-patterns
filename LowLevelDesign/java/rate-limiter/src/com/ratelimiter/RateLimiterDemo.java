package com.ratelimiter;

import com.ratelimiter.strategies.*;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RateLimiterDemo {
    public static void main(String args[]) {
        String userId = "123";
        System.out.println("----Leaky Bucket Demo----");
        runLeakyBucketDemo(userId);

        System.out.println("----Fixed Window Demo----");
        runFixedWindowDemo(userId);

        System.out.println("----Token Bucket Demo----");
        runTokenBucketDemo(userId);

        System.out.println("----Sliding Window Log Demo----");
        runSlidingWindowLogDemo(userId);

       System.out.println("----Sliding Window Counter Demo----");
       runSlidingWindowCounterDemo(userId);
    }

    private static void runLeakyBucketDemo(String userId) {
        int capacity = 5;
        double leakRate = 1.0; // 1 request per second is processed

        RateLimitingStrategy leakyBucket = new LeakyBucketRateLimiter(capacity, leakRate);
        RateLimiterApplication service = RateLimiterApplication.getInstance();
        service.setRateLimitingStrategy(leakyBucket);

        ExecutorService executor = Executors.newFixedThreadPool(3);

        for (int i = 0; i < 10; i++) {
            executor.submit(() -> service.handleRequest(userId));
            try {
                Thread.sleep(300); // faster than leak rate → causes overflow
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        executor.shutdown();
    }

    public static void runFixedWindowDemo(String userId) {
        int maxRequests = 5;
        int windowSeconds = 10;

        RateLimitingStrategy fixedWindowStrategy = new FixedWindowRateLimiter(maxRequests, windowSeconds);
        RateLimiterApplication service = RateLimiterApplication.getInstance();
        service.setRateLimitingStrategy(fixedWindowStrategy);

        ExecutorService executor = Executors.newFixedThreadPool(3);
        for(int i=0; i<10;i++) {
            executor.submit(() -> service.handleRequest(userId));
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executor.shutdown();
    }

    private static void runTokenBucketDemo(String userId) {
        int capacity = 5;
        int refillRate = 1; // 1 token per second

        RateLimitingStrategy tokenBucketStrategy = new TokenBucketRateLimiter(capacity, refillRate);
        RateLimiterApplication service = RateLimiterApplication.getInstance();
        service.setRateLimitingStrategy(tokenBucketStrategy);

        ExecutorService executor = Executors.newFixedThreadPool(2);
        for(int i = 0; i<10;i++) {
            executor.submit(() -> service.handleRequest(userId));
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executor.shutdown();
    }

    private static void runSlidingWindowLogDemo(String userId) {
        int maxRequests = 5;
        int windowSeconds = 10;

        RateLimitingStrategy slidingWindowStrategy = new SlidingWindowLogRateLimiter(maxRequests, windowSeconds);
        RateLimiterApplication service = RateLimiterApplication.getInstance();

        service.setRateLimitingStrategy(slidingWindowStrategy);
        ExecutorService executor = Executors.newFixedThreadPool(3);
        for (int i = 0; i < 10; i++) {
            executor.submit(() -> service.handleRequest(userId));
            try {
                Thread.sleep(500); // 0.5 sec between requests
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executor.shutdown();
    }

    private static void runSlidingWindowCounterDemo(String userId) {
        int maxRequests = 5;
        int windowSeconds = 10;

        RateLimitingStrategy strategy =
                new SlidingWindowCounterRateLimiter(maxRequests, windowSeconds);

        RateLimiterApplication service = RateLimiterApplication.getInstance();
        service.setRateLimitingStrategy(strategy);

        ExecutorService executor = Executors.newFixedThreadPool(3);

        for (int i = 0; i < 12; i++) {
            executor.submit(() -> service.handleRequest(userId));
            try {
                Thread.sleep(500); // Trigger overlapping windows
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }

        executor.shutdown();
    }

}
