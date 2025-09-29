package com.fooddelivery.strategies.search;

import com.fooddelivery.entities.Restaurant;

import java.util.List;

public interface RestaurantSearchStrategy {
    List<Restaurant> filter(List<Restaurant> allRestaurants);
}
