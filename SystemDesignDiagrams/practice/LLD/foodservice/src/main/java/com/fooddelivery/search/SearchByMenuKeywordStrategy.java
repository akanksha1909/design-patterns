package com.fooddelivery.search;

import com.fooddelivery.entities.MenuItem;
import com.fooddelivery.entities.Restaurant;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class SearchByMenuKeywordStrategy implements RestaurantSearchStrategy {
    private final String keyword;
    public SearchByMenuKeywordStrategy(String keyword) {
        this.keyword = keyword.toLowerCase();
    }

    public List<Restaurant> filter(List<Restaurant> allRestaurants) {
//        return allRestaurants.stream().filter(restaurant -> restaurant.getItems().
//                values().
//                stream().anyMatch(foodItem -> foodItem.getName().contains(keyword)))
//                .collect(Collectors.toList());

        List<Restaurant> results = new ArrayList<>();
        for(Restaurant restaurant: allRestaurants) {
            boolean found = false;
            for(MenuItem menuItem: restaurant.getItems().values()) {
                if(menuItem.getName().toLowerCase().contains(keyword)) {
                    found = true;
                    break;
                }
            }
            if(found) {
                results.add(restaurant);
            }
        }
        return results;
    }
}
