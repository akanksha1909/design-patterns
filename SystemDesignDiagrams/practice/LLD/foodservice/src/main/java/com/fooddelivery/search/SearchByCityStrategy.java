package com.fooddelivery.search;

import com.fooddelivery.entities.Restaurant;

import java.util.List;
import java.util.stream.Collectors;

public class SearchByCityStrategy implements RestaurantSearchStrategy {
    private final String city;
    public SearchByCityStrategy(String city) {
        this.city = city;
    }

    public List<Restaurant> filter(List<Restaurant> allRestaurants) {
        return allRestaurants.stream().
                filter(restaurant -> restaurant.getAddress().getCity().equalsIgnoreCase(city))
                                .collect(Collectors.toList());
    }
}
