package com.fooddelivery.state;

import com.fooddelivery.entities.Order;

public class ConfirmedOrderState implements OrderState {
    public void confirm(Order order) {
        order.setOrderState(new PreparedOrderState());
    }
}
