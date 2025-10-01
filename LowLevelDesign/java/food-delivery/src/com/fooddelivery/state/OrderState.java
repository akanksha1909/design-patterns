package com.fooddelivery.state;

import com.fooddelivery.entities.Order;

public interface OrderState {
    void confirm(Order order);
}
