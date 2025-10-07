package com.ratelimiter;

import com.ratelimiter.strategies.FixedWindowRateLimiter;
import com.ratelimiter.strategies.RateLimitingStrategy;

import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class RateLimiterDemo {
    public static void main(String args[]) {
        String userId = "123";

        System.out.println("----Fixed Window Demo----");
        runFixedWindowDemo(userId);
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
}
