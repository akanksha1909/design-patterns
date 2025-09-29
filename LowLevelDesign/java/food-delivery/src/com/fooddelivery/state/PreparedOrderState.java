package com.fooddelivery.state;

import com.fooddelivery.entities.Order;

public class PreparedOrderState implements OrderState{
    public void confirm(Order order) {
        System.out.println("Order is ready for pickup!");
    }
}
