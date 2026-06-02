package com.ratelimiter;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public class Demo {
    public static void main(String args[]) {
        // Token Bucket
        String userId = "123";
        int capacity = 5;
        int refillRate = 1;
        TokenBucketRateLimiter service = new TokenBucketRateLimiter(capacity, refillRate);
        ExecutorService executor = Executors.newFixedThreadPool(3);
        for(int i =0; i < 10; i++) {
            executor.submit(() -> {
                if(service.allowRequest(userId)) {
                    System.out.println("Request from user " + userId + " is allowed. ");
                } else {
                    System.out.println("Request from user " + userId + " is rejected");
                }
            });
            try {
                Thread.sleep(500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
        executor.shutdown();
    }
}
