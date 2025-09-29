package com.fooddelivery.strategies.search;

import com.fooddelivery.entities.Restaurant;

import java.util.ArrayList;
import java.util.List;

public class SearchByCityStrategy implements RestaurantSearchStrategy {

    private final String city;

    public SearchByCityStrategy(String city) {
        this.city = city;
    }

    public List<Restaurant> filter(List<Restaurant> allRestaurants) {
        List <Restaurant> restaurants = new ArrayList<>();
        allRestaurants.forEach(restaurant -> {
            if(restaurant.getAddress().getCity().equalsIgnoreCase(this.city)){
                restaurants.add(restaurant);
            }
        });
        return restaurants;
    }
}
