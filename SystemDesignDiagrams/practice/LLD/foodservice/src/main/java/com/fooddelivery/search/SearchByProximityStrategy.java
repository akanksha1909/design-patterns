package com.fooddelivery.search;

import com.fooddelivery.entities.Address;
import com.fooddelivery.entities.Restaurant;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

public class SearchByProximityStrategy implements RestaurantSearchStrategy {
    private final Address userLocation;
    private final double maxDistance;

    public SearchByProximityStrategy(Address userLocation, double maxDistance) {
        this.userLocation = userLocation;
        this.maxDistance = maxDistance;
    }

    public List<Restaurant> filter(List<Restaurant> allRestaurants) {
        return allRestaurants.stream().
                filter(restaurant -> userLocation.distanceTo(restaurant.getAddress()) <= maxDistance)
                .sorted(Comparator.comparingDouble(r -> userLocation.distanceTo(r.getAddress())))
                .collect(Collectors.toList());
    }
}
