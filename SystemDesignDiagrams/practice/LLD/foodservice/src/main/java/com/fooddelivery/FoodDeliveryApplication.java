package com.fooddelivery;

import com.fooddelivery.assignmentStrategy.DeliveryAssignmentStrategy;
import com.fooddelivery.entities.*;
import com.fooddelivery.enums.OrderStatus;
import com.fooddelivery.search.RestaurantSearchStrategy;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.concurrent.ConcurrentHashMap;

public class FoodDeliveryApplication {
    private static FoodDeliveryApplication instance;
    private final Map<String, Restaurant> restaurants = new ConcurrentHashMap<>();
    private final Map<String, Customer> customers = new ConcurrentHashMap<>();
    private final Map<String, DeliveryAgent> deliveryAgents = new ConcurrentHashMap<>();
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private DeliveryAssignmentStrategy assignmentStrategy;

    public static FoodDeliveryApplication getInstance() {
        if(FoodDeliveryApplication.instance == null) {
            FoodDeliveryApplication.instance = new FoodDeliveryApplication();
        }
        return FoodDeliveryApplication.instance;
    }

    public void setAssignmentStrategy(DeliveryAssignmentStrategy assignmentStrategy) {
        this.assignmentStrategy = assignmentStrategy;
    }

    public Restaurant registerRestaurant(String name, Address address) {
        Restaurant restaurant = new Restaurant(name, address);
        restaurants.put(restaurant.getId(), restaurant);
        return restaurant;
    }

    public Customer registerCustomer(String name, String phone, Address address) {
        Customer customer = new Customer(name, phone, address);
        customers.put(customer.getId(), customer);
        return customer;
    }

    public DeliveryAgent registerDeliveryAgent(String name, String phone, Address address) {
        DeliveryAgent deliveryAgent = new DeliveryAgent(name, phone, address);
        deliveryAgents.put(deliveryAgent.getId(), deliveryAgent);
        return deliveryAgent;
    }

    public List<Restaurant> searchRestaurants(List<RestaurantSearchStrategy> strategies) {
        List<Restaurant> results = new ArrayList<>(restaurants.values());
        for(RestaurantSearchStrategy searchStrategy: strategies) {
            results = searchStrategy.filter(results);
        }
        return results;
    }

    public Order placeOrder(String restaurantId, List<OrderItem> items, String customerId) {
        Customer customer = customers.get(customerId);
        Restaurant restaurant = restaurants.get(restaurantId);
        if(customer == null || restaurant == null) {
            throw new NoSuchElementException("Customer or Restaurant not found");
        }

        Order order = new Order(customer, restaurant, items);
        orders.put(order.getId(), order);
        customer.addToOrderHistory(order);
        return order;
    }

    public void updateOrderStatus(String orderId, OrderStatus status) {
        Order order = orders.get(orderId);
        order.setStatus(status);

        if(status == OrderStatus.READY_FOR_PICKUP) {
            assignDelivery(order);
        }
    }

    public void assignDelivery(Order order) {
        assignmentStrategy.findAgent(order, new ArrayList<>(deliveryAgents.values()))
                .ifPresentOrElse(agent -> {
                    order.assignDeliveryAgent(agent);
                    System.out.printf("Agent %s (dist: %.2f) assigned to order %s.\n",
                            agent.getName(),
                            agent.getCurrentLocation().distanceTo(order.getRestaurant().getAddress()),
                            order.getId());
                    order.setStatus(OrderStatus.READY_FOR_PICKUP);
                }, () -> System.out.println("No available delivery agents found for order " + order.getId()));
    }
}
