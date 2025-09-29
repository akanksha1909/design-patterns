package com.fooddelivery.state;

import com.fooddelivery.entities.Order;

public class PlacedOrderState implements OrderState {
    public void confirm(Order order) {
        System.out.println("Order is placed successfully");
        order.setOrderState(new ConfirmedOrderState());
    }
}
