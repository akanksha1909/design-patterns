package com.fooddelivery.observer;

import com.fooddelivery.entities.Order;

public interface OrderObserver {
    public void onUpdate(Order order);
}
