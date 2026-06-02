package com.fooddelivery.entities;

import com.fooddelivery.enums.OrderStatus;
import com.fooddelivery.observer.OrderObserver;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class Order {
    private String id;
    private final Customer customer;
    private final Restaurant restaurant;
    private final List<OrderItem> items;
    private OrderStatus status;
    private DeliveryAgent deliveryAgent;
    private final Set<OrderObserver> observers = new HashSet<>();

    public Order(Customer customer, Restaurant restaurant, List<OrderItem> items) {
        this.id = UUID.randomUUID().toString();
        this.customer = customer;
        this.restaurant = restaurant;
        this.items = items;
        this.status = OrderStatus.PENDING;
        addObserver(restaurant);
        addObserver(customer);
    }

    public void addObserver(OrderObserver observer) {
        observers.add(observer);
    }

    private void notifyObservers() { observers.forEach(o -> o.onUpdate(this)); }

    public OrderStatus getStatus() {
        return this.status;
    }

    public String getId() {
        return this.id;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
        notifyObservers();
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void assignDeliveryAgent(DeliveryAgent agent) {
        this.deliveryAgent = agent;
        this.deliveryAgent.setAvailable(false); // Mark agent as busy
    }

}
