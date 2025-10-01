package com.fooddelivery.state;

import com.fooddelivery.entities.Order;
import com.fooddelivery.enums.OrderStatus;

public class PreparedOrderState implements OrderState{
    public void confirm(Order order) {
        order.setOrderStatus(OrderStatus.READY_FOR_PICKUP);
        System.out.println("Order is ready for pickup!");
    }
}
