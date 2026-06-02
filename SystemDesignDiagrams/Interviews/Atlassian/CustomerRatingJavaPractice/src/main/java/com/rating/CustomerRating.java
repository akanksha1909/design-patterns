package com.rating;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CustomerRating {
  public static class RatingStats {
      AtomicLong totalSum;
      AtomicInteger count;
  }

  private final Map<String, RatingStats> customerRatingsMap = new ConcurrentHashMap<>();

  public void addRating(String customerId, Integer rating) {
      customerRatingsMap.computeIfAbsent(customerId, k -> new RatingStats());
      RatingStats stats = customerRatingsMap.get(customerId);
      stats.totalSum.addAndGet(rating);
      stats.count.incrementAndGet();
  }

  public double getAvgRating(String customerId) {
      RatingStats stats = customerRatingsMap.get(customerId);
      return (stats.totalSum.get()) * 1.0 / stats.count.get();
  }

}
