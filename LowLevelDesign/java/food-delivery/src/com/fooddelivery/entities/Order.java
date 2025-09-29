package com.fooddelivery.entities;

import com.fooddelivery.state.OrderState;
import com.fooddelivery.state.PlacedOrderState;

import java.util.List;
import java.util.UUID;

public class Order {
    private final String id;
    private final Customer customer;
    private final Restaurant restaurant;
    private DeliveryAgent deliveryAgent;
    private final List<OrderItem> orderItems;
    private OrderState orderState;

    public Order(Customer customer, Restaurant restaurant, List<OrderItem> orderItems) {
        this.id = UUID.randomUUID().toString();
        this.customer = customer;
        this.restaurant = restaurant;
        this.orderItems = orderItems;
        this.orderState = new PlacedOrderState();
    }

    public void setOrderState(OrderState orderState) {
        this.orderState = orderState;
    }

    public void confirm() {
        this.orderState.confirm(this);
    }

}
