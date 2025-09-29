package com.fooddelivery;

import com.fooddelivery.entities.*;
import com.fooddelivery.strategies.search.RestaurantSearchStrategy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class FoodDeliveryApp {
    private static FoodDeliveryApp instance;
    private Map<String, Customer> customers = new ConcurrentHashMap<>();
    private Map<String, Restaurant> restaurants = new ConcurrentHashMap<>();
    private Map<String, DeliveryAgent> agents = new ConcurrentHashMap<>();
    private OrderService orderService = OrderService.getInstance();

    private FoodDeliveryApp(){

    }

    public static FoodDeliveryApp getInstance() {
        if(FoodDeliveryApp.instance == null) {
            FoodDeliveryApp.instance = new FoodDeliveryApp();
        }
        return FoodDeliveryApp.instance;
    }

    public Customer registerCustomer(String name, String phone, Address address) {
        Customer customer = new Customer(name, phone, address);
        this.customers.put(customer.getId(), customer);
        return customer;
    }

    public Restaurant registerRestaurant(String name, Address address) {
        Restaurant restaurant = new Restaurant(name, address);
        this.restaurants.put(restaurant.getId(), restaurant);
        return restaurant;
    }

    public void registerDeliveryAgent(String name, String phone, Address address) {
        DeliveryAgent agent = new DeliveryAgent(name, phone, address);
        this.agents.put(agent.getId(), agent);
    }

    public List<Restaurant> searchRestaurant(RestaurantSearchStrategy searchStrategy) {
        return searchStrategy.filter(new ArrayList<>(this.restaurants.values()));
    }

    public Order createOrder(Customer alice, String restaurantId, List<OrderItem> orderItems) {
        return orderService.createOrder(alice, this.restaurants.get(restaurantId), orderItems);
    }
}
