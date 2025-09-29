package com.fooddelivery.state;

import com.fooddelivery.entities.Order;
import com.fooddelivery.enums.OrderStatus;

public class ConfirmedOrderState implements OrderState {
    public void confirm(Order order) {
        order.setOrderStatus(OrderStatus.PREPARING);
        order.setOrderState(new PreparedOrderState());
    }
}
