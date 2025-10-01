package com.fooddelivery;

import com.fooddelivery.entities.Customer;
import com.fooddelivery.entities.Order;
import com.fooddelivery.entities.OrderItem;
import com.fooddelivery.entities.Restaurant;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OrderService {
    private static OrderService instance;
    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private OrderService() {}
    public static OrderService getInstance() {
        if(OrderService.instance == null) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }

    public Order createOrder(Customer alice, Restaurant restaurant, List<OrderItem> orderItems){
        Order order = new Order(alice, restaurant, orderItems);
        order.confirm();
        return order;
    }

}
