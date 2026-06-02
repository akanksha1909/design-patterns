package com.rating;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class AtomicVariableVersion {
    private static class RatingStats {
        AtomicLong total = new AtomicLong(0);
        AtomicInteger count = new AtomicInteger(0);
    }

    private final ConcurrentHashMap<String, RatingStats> ratings = new ConcurrentHashMap<>();

    public void addRating(String customerId, Integer rating) {
        ratings.computeIfAbsent(customerId, k -> new RatingStats());
        RatingStats stats = ratings.get(customerId);

        stats.total.addAndGet(rating);
        stats.count.incrementAndGet();
    }

    public double getAvgRating(String customerId) {
        RatingStats stats = ratings.get(customerId);
        if(stats == null || stats.count.get() == 0) {
            return 0.0;
        }
        return stats.total.get() * 1.0 / stats.count.get();
    }
}
