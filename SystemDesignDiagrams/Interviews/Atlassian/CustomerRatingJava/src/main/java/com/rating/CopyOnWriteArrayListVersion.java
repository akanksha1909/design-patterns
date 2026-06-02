package com.rating;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

// Con: Not great for heavy write application
public class CopyOnWriteArrayListVersion {
    private final Map<String, List<Integer>> ratings = new ConcurrentHashMap<>();
    public void CopyOnWriteArrayListVersion() {

    }

    public void addRating(String customerId, int rating) {
        ratings.computeIfAbsent(customerId, k -> new CopyOnWriteArrayList<>()).add(rating);
    }

    public double getAvgRating(String customerId) {
        List<Integer> customerRatings = ratings.get(customerId);
        int totalRatings = 0;
        for(int rating: customerRatings) {
            totalRatings += rating;
        }
        return totalRatings / customerRatings.size();
    }
}
