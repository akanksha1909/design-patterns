package com.fooddelivery.state;

import com.fooddelivery.entities.Order;
import com.fooddelivery.enums.OrderStatus;

public class PlacedOrderState implements OrderState {
    public void confirm(Order order) {
        System.out.println("Order is placed successfully");
        order.setOrderStatus(OrderStatus.CONFIRMED);
        order.setOrderState(new ConfirmedOrderState());
    }
}
